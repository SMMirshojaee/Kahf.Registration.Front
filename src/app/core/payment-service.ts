import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { PaymentDto } from '@app/share/models/payment.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/payment`;

  getAmountByRegStepId(regStepId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.address}/getAmountByRegStepId/${regStepId}`);
  }
  getByRegStepId(regStepId: number): Observable<PaymentDto> {
    return this.httpClient.get<PaymentDto>(`${this.address}/getByRegStepId/${regStepId}`);
  }
  getByRegId(regId: number): Observable<PaymentDto[]> {
    return this.httpClient.get<PaymentDto[]>(`${this.address}/getByRegId/${regId}`);
  }
}

