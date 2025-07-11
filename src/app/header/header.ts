import { Component } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [SHARE_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header extends GenericComponent {
  get isLogin(): boolean {
    if (this.tokenService.getActor())
      return true;
    return false;
  }
  ngOnInit() {
    let darkMode = this.tokenService.getDarkMode();
    if (darkMode)
      this.toggleDarkMode();
  }
  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element?.classList.contains('app-dark-style'))
      this.tokenService.setDarkMode(false);
    else
      this.tokenService.setDarkMode(true);
    element?.classList.toggle('app-dark-style');
  }
  gotoHome() {
    if (this.tokenService.getActor()?.toLowerCase() == 'applicant')
      this.route('/applicant/dashboard');
    else if (this.tokenService.getActor()?.toLowerCase() == 'admin')
      this.route('/admin/dashboard');
    else
      this.route('');

  }
  logout() {
    this.tokenService.logout();
  }
}
