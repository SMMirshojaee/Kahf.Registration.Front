import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '@app/core/applicant-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
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
  private regId;
  /**
   *
   */
  constructor() {
    super();
    this.signupForm = new FormGroup({
      nationalCode: new FormControl('0011227168', [Validators.required, NationalCodeValidator]),
      mobile: new FormControl('09128486146', [Validators.required, MobileValidator])
    });

  }
  ngOnInit() {
    this.regId = this.activatedRoute.snapshot.params['id'];
    if (!this.regId) {
      this.notify.error('ثبت نام مورد نظر یافت نشد');
      this.route('/')
      return;
    }
  }

  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsDirty();
      this.notify.warn('موارد مشخص شده را برطرف نمایید');
      return;
    }
    const mobile = this.signupForm.get('mobile')?.value;
    const nationalCode = this.signupForm.get('nationalCode')?.value;
    this.spinnerService.show();
    this.applicantService.signup(this.regId, { nationalCode: nationalCode, mobile: mobile })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          localStorage.setItem("jwtToken", data.tokenString);
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
}
