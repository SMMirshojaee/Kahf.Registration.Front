import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button'; // add this line
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule,ButtonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  private router = inject(Router);
  route(address:string) {
    this.router.navigate([address])
  }
}
