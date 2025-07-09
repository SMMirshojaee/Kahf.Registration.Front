import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '@app/core/applicant-service';
import { RegService } from '@app/core/reg-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { SigninDto } from '@app/share/models/applicant.dto';
import { RegDto } from '@app/share/models/reg.dto';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-followup',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './signIn.html',
  styleUrl: './signIn.scss'
})
export class signIn extends GenericComponent {
  private applicantService = inject(ApplicantService);
  private regService = inject(RegService);
  private activatedRoute = inject(ActivatedRoute);
  protected followupForm: FormGroup;
  private regId;
  protected reg: RegDto;

  constructor() {
    super();
    this.followupForm = new FormGroup({
      nationalCode: new FormControl('0011227168', [Validators.required, NationalCodeValidator]),
      mobile: new FormControl('09128486146', [Validators.required, MobileValidator]),
      trackingCode: new FormControl('12345', [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    });

  }
  ngOnInit() {
    this.regId = this.activatedRoute.snapshot.params['id'];
    if (!this.regId) {
      this.notify.error('ثبت نام مورد نظر یافت نشد');
      this.route('/')
      return;
    }
    let selectedReg = this.tokenService.getSelectedReg();
    if (selectedReg.id == this.regId) {
      this.reg = selectedReg;
      return;
    }
    this.spinnerService.show();
    this.regService.getById(this.regId)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.tokenService.setSelectedReg(data);
          this.reg = data;
        }, error: err => {
          this.notify.defaultError();
        }
      })
  }
  submit() {
    if (this.followupForm.invalid) {
      this.followupForm.markAllAsDirty();
      this.notify.warn('موارد مشخص شده را برطرف نمایید');
      return;
    }
    const nationalCode = this.followupForm.get('nationalCode')?.value;
    const mobile = this.followupForm.get('mobile')?.value;
    const trackingCode = this.followupForm.get('trackingCode')?.value;
    this.spinnerService.show();
    this.applicantService.singin(this.regId, { nationalCode, mobile, trackingCode } as SigninDto)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          debugger
          this.tokenService.setTokenString(data.tokenString);
          this.route('/applicant/dashboard');
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 404)
            this.notify.error(err.error)
          else
            this.notify.defaultError();
        }
      })
  }
}
