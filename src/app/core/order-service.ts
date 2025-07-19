import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
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
}
