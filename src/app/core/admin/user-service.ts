import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/user`;

  login(username: string, password: string): Observable<string> {
    return this.httpClient.get(`${this.address}/login/${username}/${password}`, { responseType: 'text' });
  }

  sendSms(): Observable<string> {
    return this.httpClient.get(`${this.address}/sendSms`, { responseType: 'text' });
  }

}
