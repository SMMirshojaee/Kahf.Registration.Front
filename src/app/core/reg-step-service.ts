import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { RegStepDto } from '@app/share/models/reg.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegStepService {

  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/regStep`;

  getAll(): Observable<RegStepDto[]> {
    return this.httpClient.get<RegStepDto[]>(`${this.address}/getAll`);
  }

  getByRegId(regId: number): Observable<RegStepDto[]> {
    return this.httpClient.get<RegStepDto[]>(`${this.address}/getByRegId/${regId}`);
  }

  getById(regStepId: number): Observable<RegStepDto> {
    return this.httpClient.get<RegStepDto>(`${this.address}/getById/${regStepId}`);
  }

  getNextStep(currentRegStepId: number): Observable<RegStepDto> {
    return this.httpClient.get<RegStepDto>(`${this.address}/getNextStep/${currentRegStepId}`);
  }
}
