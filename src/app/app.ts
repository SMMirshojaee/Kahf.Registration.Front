import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IMPORTS } from './share/imports';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IMPORTS,Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  private route = inject(Router);

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-style');
  }
  gotoRoute(address: string) {
    this.route.navigate([address])
  }
}
