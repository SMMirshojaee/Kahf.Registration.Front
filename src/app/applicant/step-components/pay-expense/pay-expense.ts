import { Component } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone:true,
  imports: [SHARE_IMPORTS],
  templateUrl: './pay-expense.html',
  styleUrl: './pay-expense.scss'
})
export class PayExpense {

}
