import { Component } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  selector: 'app-not-found-page',
  imports: [SHARE_IMPORTS],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
  standalone: true
})
export class NotFoundPage extends GenericComponent {

}
