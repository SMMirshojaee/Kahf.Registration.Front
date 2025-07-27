import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { OrderDto } from '@app/share/models/payment.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/order`;

  sendRequest(regStepId: number): Observable<string> {
    return this.httpClient.get(`${this.address}/sendRequest/${regStepId}`, { responseType: 'text' })
  }
  payCash(regStepId: number, cash: number) : Observable<string>{
    return this.httpClient.get(`${this.address}/payCash/${regStepId}/${cash}`, { responseType: 'text' })
  }
  requestLoan(regStepId: number, loan: number, cash: number) {
    return this.httpClient.get(`${this.address}/requestLoan/${regStepId}/${loan}/${cash}`, { responseType: 'text' })
  }
  getPrevious(regStepId: number): Observable<OrderDto[]> {
    return this.httpClient.get<OrderDto[]>(`${this.address}/getPrevious/${regStepId}`);
  }
}
