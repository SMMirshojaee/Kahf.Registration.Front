import { Component } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment extends GenericComponent {

  ngOnInit() {
    let messageCode = this.activatedRoute.snapshot.queryParams["messageCode"];
    switch (messageCode) {
      case "0":
        break;
      case "1": break;
      case "2": break;
      case "3": break;
    }
  }
}
