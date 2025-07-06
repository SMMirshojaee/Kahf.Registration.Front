import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  private router = inject(Router);
  route(address:string) {
    this.router.navigate([address])
  }
}
