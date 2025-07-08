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

  ngOnInit() {
    let darkMode = localStorage.getItem('dark-mode')
    if (darkMode.toLowerCase() == 'true')
      this.toggleDarkMode();
  }
  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element?.classList.contains('app-dark-style'))
      localStorage.setItem('dark-mode', false.toString());
    else
      localStorage.setItem('dark-mode', true.toString());
    element?.classList.toggle('app-dark-style');
  }
  gotoRoute(address: string) {
    this.route(address)
  }
}
