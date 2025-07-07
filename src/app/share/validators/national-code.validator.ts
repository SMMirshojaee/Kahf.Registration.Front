import { AbstractControl, ValidationErrors } from "@angular/forms";

export function NationalCodeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    if (!/^\d{10}$/.test(value)) {
      return { nationalCode: 'فرمت کد ملی صحیح نیست' };
    }

    const check = +value[9];
    const sum = value
      .split('')
      .slice(0, 9)
      .reduce((acc: number, digit: string | number, index: number) => acc + (+digit * (10 - index)), 0);
    const remainder = sum % 11;

    const isValid =
      (remainder < 2 && check === remainder) ||
      (remainder >= 2 && check === 11 - remainder);

    return isValid ? null : { nationalCode: 'کد ملی نامعتبر است' };
  }