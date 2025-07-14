import { Component } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login extends GenericComponent {


  convertToEnglishDigits(event: any): void {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    event.target.value = event.target.value.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
  }
}
