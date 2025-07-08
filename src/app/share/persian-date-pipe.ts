import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from 'jalali-ts';

@Pipe({
  name: 'persianDate',
  standalone: true,
})
export class PersianDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value)
      return value.toString();
    let date = new Date(value);
    let jalaliDate = Utils.toJalali(date);

    return `${jalaliDate.year}/${jalaliDate.month}/${jalaliDate.date}`;
  }

}
