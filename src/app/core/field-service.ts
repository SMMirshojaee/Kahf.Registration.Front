import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { FieldDto } from '@app/share/models/field.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/field`;

  getByRegStepId(regStepId: number, memberId?: number): Observable<FieldDto[]> {
    if (memberId)
      return this.httpClient.get<FieldDto[]>(`${this.address}/getByRegStepId/${regStepId}/${memberId}`);
    return this.httpClient.get<FieldDto[]>(`${this.address}/getByRegStepId/${regStepId}`);
  }
}
