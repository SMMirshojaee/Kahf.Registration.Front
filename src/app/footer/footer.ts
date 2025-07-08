import { Component } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';

@Component({
  standalone:true,
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer extends GenericComponent{

}
