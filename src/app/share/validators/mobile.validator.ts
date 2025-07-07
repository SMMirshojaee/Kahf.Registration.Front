import { AbstractControl, ValidationErrors } from '@angular/forms';

export function MobileValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const pattern = /^09\d{9}$/;

  if (!pattern.test(value)) {
    return { iranMobile: 'شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد).' };
  }

  return null;
}