import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IMPORTS } from '@app/share/imports';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule, IMPORTS],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  ingredient: boolean = true;
  private router = inject(Router);
  route(address: string) {
    this.router.navigate([address])
  }
}
