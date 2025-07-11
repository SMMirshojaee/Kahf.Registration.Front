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

  GetByRegStepId(regStepId: number, memberId?: number): Observable<ApplicantFormValueDto[]> {
    if (memberId)
      return this.httpClient.get<ApplicantFormValueDto[]>(`${this.address}/GetByRegStepId/${regStepId}/${memberId}`);
    return this.httpClient.get<ApplicantFormValueDto[]>(`${this.address}/GetByRegStepId/${regStepId}`);
  }

  insert(regStepId: number, applicantFormValues: ApplicantFormValueDto[], memberId?: number): Observable<string> {
    if (memberId)
      return this.httpClient.post<string>(`${this.address}/insert/${regStepId}/${memberId}`, applicantFormValues)
    return this.httpClient.post<string>(`${this.address}/insert/${regStepId}`, applicantFormValues)
  }

  upload(fileName: string, image: File, memberId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    if (memberId)
      return this.httpClient.post(`${this.address}/upload/${fileName}/${memberId}`, formData);
    return this.httpClient.post(`${this.address}/upload/${fileName}`, formData);
  }
}
