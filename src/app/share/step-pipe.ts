import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'step',
  standalone: true
})
export class StepPipe implements PipeTransform {

  transform(value: number | string): string {
    switch (value.toString()) {
      case "1": return "پرکردن فرم";
      case "2": return "واریز وجه";
      case "3": return "قبول / رد";
      case "4": return "پرداخت قسط";
      default: return "نا مشخص!!";
    }
  }

}
