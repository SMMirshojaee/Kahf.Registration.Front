import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, Input, inject } from '@angular/core';
import { Params } from '@angular/router';
import { RegCostService } from '@app/core/admin/reg-cost-service';
import { ApplicantService } from '@app/core/applicant-service';
import { OrderService } from '@app/core/order-service';
import { PaymentService } from '@app/core/payment-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantExtraCostDto, OrderDto } from '@app/share/models/payment.dto';
import { RegCostDto, RegStepDto } from '@app/share/models/reg.dto';
import { PersianDatePipe } from '@app/share/persian-date-pipe';
import { TomanPipe } from '@app/share/toman-pipe';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'pay-installments',
  standalone: true,
  imports: [SHARE_IMPORTS, PersianDatePipe, TomanPipe],
  templateUrl: './pay-installments.html',
  styleUrl: './pay-installments.scss'
})
export class PayInstallments extends GenericComponent {
  private regCostService = inject(RegCostService);
  private applicantService = inject(ApplicantService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  protected loans: OrderDto[];
  protected regCosts: RegCostDto[];
  protected extraCosts: ApplicantExtraCostDto[];
  protected totalCosts: number;
  protected applicantOrders: OrderDto[];
  protected totalPays: number;
  //مقدار باقی مانده نقدی(کل هزینه منهای واریز شده های آنلاین و وام)
  protected remainedAmount: number;

  protected totalReceivedPays: number;

  @Input({ required: true }) public regStep: RegStepDto;
  @Input({ required: true }) public membersCount: number;

  ngOnInit() {
    this.spinnerService.show();

    forkJoin({
      regCosts: this.regCostService.getByRegId(this.regStep.regId),
      extraCosts: this.applicantService.getExtraCosts(),
      orders: this.orderService.getAll(),
      paymentRules: this.paymentService.getByRegId(this.regStep.regId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.regCosts = data.regCosts;
          this.extraCosts = data.extraCosts;
          this.totalCosts = this.regCosts.map(e => e.amount).reduce((val, sum) => sum += val, 0) * (this.membersCount + 1);
          if (this.extraCosts)
            this.totalCosts += this.extraCosts.map(e => e.amount).reduce((val, sum) => sum += val, 0);

          this.applicantOrders = data.orders;
          this.totalPays = this.applicantOrders.map(e => e.amount).reduce((val, sum) => sum += val, 0);
          this.totalReceivedPays = this.applicantOrders.filter(e => e.authority.toLowerCase() != 'loan').map(e => e.amount).reduce((val, sum) => sum += val, 0);
          this.totalReceivedPays += this.applicantOrders.filter(e => e.authority.toLowerCase() == 'loan').flatMap(e => e.inverseLoan.map(o => o.amount)).reduce((val, sum) => sum += val, 0);

          this.remainedAmount = this.totalCosts - this.totalPays;

          this.loans = this.applicantOrders.filter(e => e.authority.toLowerCase() == 'loan');

          this.loans.forEach(loan => {
            let totalReceived = loan.inverseLoan.map(e => e.amount).reduce((val, sum) => sum += val, 0);
            if (loan.amount <= totalReceived)
              loan.totalyCleared = true;
            else {

              let payment = data.paymentRules.find(e => e.regStepId == loan.regStepId);
              if (payment)
                loan.installmentsCount = payment.installmentsCount;
              loan.installments = loan.inverseLoan.map(e => ({ amount: e.amount, received: true, date: e.createdDate }));
              let remained = loan.amount - totalReceived;
              let remainedInstallments = payment.installmentsCount - loan.inverseLoan.length;
              for (let index = 0; index < remainedInstallments; index++) {
                if (index < remainedInstallments - 1) {
                  let amount = remained / remainedInstallments - (remained / remainedInstallments) % 100_000;
                  loan.installments.push({ amount: amount, received: false })
                } else {
                  let amount = remained - loan.installments.filter(e => !e.received).map(e => e.amount).reduce((val, sum) => sum += val, 0);
                  loan.installments.push({ amount: amount, received: false })
                }
              }
            }
          })
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }

  payExpense(amount: number, loanId?: number) {
    let params: Params;
    if (loanId)
      params = { loanId: loanId, amount: amount };
    else
      params = { amount: amount };
    this.route(`/applicant/pay`, params);
  }
}
