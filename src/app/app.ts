import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SHARE_IMPORTS } from './share/imports';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { GenericComponent } from './share/generic-component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SHARE_IMPORTS, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  providers: [DecimalPipe]
})
export class App extends GenericComponent {

  ngOnInit() {
  }

  getClass() {
    let actor = this.tokenService.getActor()?.toLowerCase();
    if (actor == 'admin' || actor == 'superadmin')
      return '';
    else return 'lg:col-4';
  }

}
