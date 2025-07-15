import { Component, inject } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegTile } from '../components/reg-tile/reg-tile';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, RegTile],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',

})
export class Dashboard extends GenericComponent {
  private activateRoute = inject(ActivatedRoute);
  private regId: number;
  ngOnInit() {
    this.regId = this.activateRoute.snapshot.params['id'];
  }

}
