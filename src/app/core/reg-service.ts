import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { RegDto } from '@app/share/models/reg.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/reg`;
  constructor() { }

  getReg(): Observable<RegDto> {
    return this.httpClient.get<RegDto>(`${this.address}/GetAll`);
  }
  getDefault(): Observable<RegDto> {
    return this.httpClient.get<RegDto>(`${this.address}/GetDefault`);
  }
}
