import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { ApplicantService } from '@app/core/applicant-service';
import { OrderService } from '@app/core/order-service';
import { PaymentService } from '@app/core/payment-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { PaymentDto } from '@app/share/models/payment.dto';
import { ConfirmationService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './pay-expense.html',
  styleUrl: './pay-expense.scss',
  providers: [ConfirmationService]
})
export class PayExpense extends GenericComponent {
  private paymentService = inject(PaymentService);
  private applicantService = inject(ApplicantService);
  private orderService = inject(OrderService);
  private confirmationService = inject(ConfirmationService);
  private regStepId: number;
  protected amount: number;
  protected payment: PaymentDto;
  protected loanIsDisable = false;

  protected loan: number;
  protected cash: number;

  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      payment: this.paymentService.getByRegStepId(this.regStepId),
      membersCount: this.applicantService.getMembersCount(),
      previousOrders: this.orderService.getPrevious(this.regStepId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.payment = data.payment;
          this.amount = (data.membersCount + 1) * data.payment.perPersonAmount;
          let previousOrders = data.previousOrders;
          if (previousOrders?.length) {
            let totalLoans = previousOrders.filter(e => e.authority == "LOAN").reduce((sum, item) => sum + item.amount, 0);
            if (totalLoans) {
              this.loan = totalLoans;
              this.loanIsDisable = true;
              this.loanChanged();
              return;
            }
          }
          this.loan = this.amount;
          this.loanChanged();
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  loanChanged() {
    if (this.loan > this.amount)
      this.loan = this.amount;
    if (this.loan < 0)
      this.loan = 0
    if (this.loan % 1_000_000) {
      this.loan = Math.round(this.loan / 1_000_000) * 1_000_000;
    }
    this.cash = this.amount - this.loan;
  }
  showConfirmationModal() {
    this.confirmationService.confirm({
      key: 'loanConfirmModal',
      message: `آیا از دریافت ${this.loan} ریال بصورت وام و پرداخت ${this.cash} ریال به صورت نقد اطمینان دارید؟`,
      acceptLabel: 'بله',
      rejectLabel: 'انصراف',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.spinnerService.show();
        this.orderService.requestLoan(this.regStepId, this.loan, this.cash)
          .pipe(finalize(() => this.spinnerService.hide()))
          .subscribe({
            next: data => {
              if (data.toLowerCase().startsWith('http'))
                window.location.href = data;
              else {
                this.notify.success(data);
                this.route('/applicant/dashboard')
              }
            },
            error: (err: HttpErrorResponse) => {
              this.notify.defaultError();
            }
          })
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
  payCash() {
    this.spinnerService.show();
    this.orderService.payCash(this.regStepId, this.cash)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          if (data.toLowerCase().startsWith('http'))
            window.location.href = data;
          else
            this.notify.success(data);
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
}
