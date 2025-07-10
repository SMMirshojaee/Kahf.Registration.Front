import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicantFormValueService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/applicantFormValue`;

  GetByRegStepId(regStepId: number): Observable<ApplicantFormValueDto[]> {
    return this.httpClient.get<ApplicantFormValueDto[]>(`${this.address}/GetByRegStepId/${regStepId}`);
  }
}
