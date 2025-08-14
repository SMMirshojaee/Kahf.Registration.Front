import { Component, inject } from '@angular/core';
import { RegCostService } from '@app/core/admin/reg-cost-service';
import { ApplicantService } from '@app/core/applicant-service';
import { OrderService } from '@app/core/order-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  selector: 'pay-installments',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './pay-installments.html',
  styleUrl: './pay-installments.scss'
})
export class PayInstallments extends GenericComponent {
  private regCostService = inject(RegCostService);
  private applicantService = inject(ApplicantService);
  private orderService = inject(OrderService);

  ngOnInit() {
    this.spinnerService.show();

  }
}
