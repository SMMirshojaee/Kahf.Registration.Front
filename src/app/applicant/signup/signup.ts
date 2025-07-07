import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantService } from '@app/core/applicant-service';
import { SHARE_IMPORTS } from '@app/share/imports';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private router = inject(Router);
  protected signupForm: FormGroup;
  private applicantService = inject(ApplicantService);
  /**
   *
   */
  constructor() {
    this.signupForm = new FormGroup({
      nationalCode: new FormControl('', [Validators.required, NationalCodeValidator]),
      mobile: new FormControl('', [Validators.required, MobileValidator])
    })

  }

  route(address: string) {
    this.router.navigate([address])
  }
  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsDirty();
      return;
    }
    const mobile = this.signupForm.get('mobile')?.value;
    const nationalCode = this.signupForm.get('nationalCode')?.value;
    this.applicantService.signup({ nationalCode: nationalCode, mobile: mobile })
      .subscribe({
        next: data => {

        }, error: (err: HttpErrorResponse) => {
debugger
        }
      })
  }
}
