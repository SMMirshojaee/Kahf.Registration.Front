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

  getById(id: number): Observable<RegDto> {
    return this.httpClient.get<RegDto>(`${this.address}/GetById/${id}`);
  }
  getAll(): Observable<RegDto[]> {
    return this.httpClient.get<RegDto[]>(`${this.address}/GetAll`);
  }

  getActiveRegs(): Observable<RegDto[]> {
    return this.httpClient.get<RegDto[]>(`${this.address}/GetActiveRegs`);
  }
}
