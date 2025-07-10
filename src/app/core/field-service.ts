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

  getByRegStepId(regStepId: number): Observable<FieldDto[]> {
    return this.httpClient.get<FieldDto[]>(`${this.address}/getByRegStepId/${regStepId}`);
  }
}
