import { Component, inject } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [SHARE_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header extends GenericComponent {
  private location = inject(Location);
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
    if (element?.classList.contains('app-dark-style')) {
      this.tokenService.setDarkMode(false);
    }
    else {
      this.tokenService.setDarkMode(true);
    }
    element?.classList.toggle('app-dark-style');
  }
  gotoHome() {
    let actor = this.tokenService.getActor()?.toLowerCase();
    if (actor == 'applicant')
      this.route('/applicant/dashboard');
    else if (actor == 'admin' || actor == 'superadmin')
      this.route('/admin/regs');
    else
      this.route('');

  }
  goBack() {
    this.location.back();
  }
  logout() {
    this.tokenService.logout();
  }
}
