import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [SHARE_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header extends GenericComponent{
  private route = inject(Router);

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-style');
  }
  gotoRoute(address: string) {
    this.route.navigate([address])
  }
}
