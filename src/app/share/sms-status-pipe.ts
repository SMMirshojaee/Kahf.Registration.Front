import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smsStatus',
  standalone: true
})
export class SmsStatusPipe implements PipeTransform {

  transform(value: number | string): string {
    value = value.toString();

    switch (value) {
      case "1": return 'رسیده به گوشی';
      case "2": return 'نرسیده به گوشی';
      case "8": return 'رسیده به مخابرات';
      case "16": return 'نرسیده به مخابرات';
      default: return 'نامشخص';
    }
  }

}
