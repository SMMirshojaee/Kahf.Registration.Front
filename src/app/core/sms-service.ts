import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/sms`;

  send(text: string, applicantIds: number[]): Observable<any> {
    return this.httpClient.post<any>(`${this.address}/send`, { text: text, applicantIds: applicantIds });
  }
}
