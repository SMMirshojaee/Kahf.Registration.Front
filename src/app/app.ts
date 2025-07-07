import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SHARE_IMPORTS } from './share/imports';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SHARE_IMPORTS, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  providers:[]
})
export class App {

  
}
