import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { OrderService } from '@app/core/order-service';
import { PaymentService } from '@app/core/payment-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './pay-expense.html',
  styleUrl: './pay-expense.scss'
})
export class PayExpense extends GenericComponent {
  private paymentService = inject(PaymentService);
  private orderService = inject(OrderService);
  private regStepId: number;
  protected amount: number;

  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    this.paymentService.getAmountByRegStepId(this.regStepId)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.amount = data;
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  getUrl() {
    this.spinnerService.show();
    this.orderService.sendRequest(this.regStepId)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          window.location.href = data;
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
}
