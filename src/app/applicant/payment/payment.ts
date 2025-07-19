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
  protected paymentReport = '';
  protected authority = '';
  ngOnInit() {
    let messageCode = this.activatedRoute.snapshot.queryParams["messageCode"];
    this.authority = this.activatedRoute.snapshot.queryParams['authority'];
    switch (messageCode) {
      case "0":
        let refId = this.activatedRoute.snapshot.queryParams['refId'];
        this.paymentReport = `زائر گرامی پرداخت شما با موفقیت انجام شد. کد رهگیری: '${refId}' می باشد. لطفا این اطلاعات را نزد خود نگه دارید.`
        break;
      case "1":
        this.paymentReport = `زائر گرامی. پرداخت شما انجام نشد. چنانچه مبلغی از حساب شما کسر شده است، طی 72 ساعت به حساب بازخواهد گشت`;
        break;
      case "2":
        this.paymentReport = 'سفارش شما در سامانه یافت نشد. چنانچه مبلغی از حساب شما کسر شده است لطفا با پشتیبانی سامانه در پیامرسان بله تماس حاصل فرمایید';
        break;
      case "3":
      default:
        this.paymentReport = 'پرداخت شما از طرف بانک تایید نگردید. چنانچه مبلغی از حساب شما کسر شده است لطفا با پشتیبانی سامانه در پیامرسان بله تماس حاصل فرمایید'
        break;
    }
  }
}
