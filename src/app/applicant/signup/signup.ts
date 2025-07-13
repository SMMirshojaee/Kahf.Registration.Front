import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '@app/core/applicant-service';
import { RegService } from '@app/core/reg-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { SignupDto } from '@app/share/models/applicant.dto';
import { RegDto } from '@app/share/models/reg.dto';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  providers: []
})
export class Signup extends GenericComponent {
  private activatedRoute = inject(ActivatedRoute);
  protected signupForm: FormGroup;
  private applicantService = inject(ApplicantService);
  private regService = inject(RegService);
  private regId;
  protected reg: RegDto;
  /**
   *
   */
  constructor() {
    super();
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      nationalCode: new FormControl('', [Validators.required, NationalCodeValidator]),
      mobile: new FormControl('', [Validators.required, MobileValidator])
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
    if (selectedReg?.id == this.regId) {
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
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsDirty();
      this.notify.warn('موارد مشخص شده را برطرف نمایید');
      return;
    }
    const firstName = this.signupForm.get('firstName')?.value;
    const lastName = this.signupForm.get('lastName')?.value;
    const mobile = this.signupForm.get('mobile')?.value;
    const nationalCode = this.signupForm.get('nationalCode')?.value;
    this.spinnerService.show();
    this.applicantService.signup(this.regId, { firstName: firstName, lastName: lastName, nationalCode: nationalCode, mobile: mobile } as SignupDto)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.tokenService.setTokenString(data.tokenString);
          this.route('/applicant/dashboard');
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 0)
            this.notify.disconnect();
          else if (err.status == 404)
            this.notify.error('ثبت نام مورد نظر یافت نشد');
          else
            this.notify.error(err.error);
        }
      })
  }
  convertToEnglishDigits(event: any, fieldName: string): void {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    event.target.value = event.target.value.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
    // اگر از FormControl استفاده می‌کنی، مقدار رو هم به‌روز کن:
    this.signupForm.controls[fieldName].setValue(event.target.value, { emitEvent: false });
  }
}
