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

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-style');
  }
  gotoRoute(address: string) {
    this.route(address)
  }
}
