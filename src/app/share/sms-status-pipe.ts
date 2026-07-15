import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smsStatus',
  standalone: true
})
export class SmsStatusPipe implements PipeTransform {

  transform(value: number | string): string {
    value = value?.toString();
    //Magfa
    // switch (value) {
    //   case "1": return 'رسیده به گوشی';
    //   case "2": return 'نرسیده به گوشی';
    //   case "8": return 'رسیده به مخابرات';
    //   case "16": return 'نرسیده به مخابرات';
    //   default: return 'نامشخص';
    // }
    switch (value) {
      case "1": return 'رسیده به گوشی';
      case "2": return 'نرسیده به گوشی';
      case "3": return 'رسیده به مخابرات';
      case "4": return 'نرسیده به مخابرات';
      case "5": return 'رسیده به اپراتور';
      case "6": return 'ناموفق';
      case "7": return 'لیست سیاه';
      default: return 'نامشخص';
    }
  }

}
