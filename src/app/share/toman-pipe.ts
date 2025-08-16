import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'toman',
  standalone: true,
})
export class TomanPipe implements PipeTransform {
  private numberPipe = inject(DecimalPipe);
  transform(valueInRial: number, showUnit = false): string {
    return `${this.numberPipe.transform(valueInRial / 10)}${(showUnit?' تومن':'')}`;
  }

}
