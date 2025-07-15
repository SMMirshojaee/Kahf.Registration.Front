import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { UserService } from '@app/core/admin/user-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login extends GenericComponent {
  protected username = '';
  protected password = '';
  private userService = inject(UserService);

  convertToEnglishDigits(event: any): void {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    event.target.value = event.target.value.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
  }

  login() {
    if (!this.username || !this.password) {
      this.notify.warn('همه فیلد ها رو وارد کن');
    } else {
      this.userService.login(this.username, this.password)
        .subscribe({
          next: data => {
            this.tokenService.setTokenString(data);
            this.route('/admin/regs');
          }, error: (err: HttpErrorResponse) => {
            if (err.status == 403)
              this.notify.error('اطلاعات شما یافت نشد');
            else
              this.notify.defaultError();
          }
        })
    }
  }
}
