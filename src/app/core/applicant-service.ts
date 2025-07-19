import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { ApplicantWithFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { ApplicantDto, ApplicantInfoDto, MemberInfoDto, SigninDto, SignupDto } from '@app/share/models/applicant.dto';
import { TokenDto } from '@app/share/models/token.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/applicant`;

  signup(regId: number, signupForm: SignupDto): Observable<TokenDto> {
    return this.httpClient.post<TokenDto>(`${this.address}/signup/${regId}`, signupForm)
  }
  singin(regId: number, signinForm: SigninDto): Observable<TokenDto> {
    return this.httpClient.put<TokenDto>(`${this.address}/singin/${regId}`, signinForm)
  }

  getStatus(): Observable<ApplicantDto> {
    return this.httpClient.get<ApplicantDto>(`${this.address}/getStatus/`)
  }
  getMembers(): Observable<MemberInfoDto[]> {
    return this.httpClient.get<MemberInfoDto[]>(`${this.address}/getMembers`)
  }

  addMember(regStepId: number, addMemberForm: SignupDto): Observable<MemberInfoDto> {
    return this.httpClient.post<MemberInfoDto>(`${this.address}/addMember/${regStepId}`, addMemberForm)
  }

  removeMember(memberId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.address}/removeMember/${memberId}`)
  }
  finishFormStep(regStepId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.address}/finishFormStep/${regStepId}`, null)
  }

  getByRegId(regId: number): Observable<ApplicantInfoDto[]> {
    return this.httpClient.get<ApplicantInfoDto[]>(`${this.address}/getByRegId/${regId}`);
  }

  getWithFormValuesWithRegStepId(regStepId: number): Observable<ApplicantWithFormValueDto[]> {
    return this.httpClient.get<ApplicantWithFormValueDto[]>(`${this.address}/GetWithFormValuesWithRegStepId/${regStepId}`)
  }

  changeApplicantStatus(applicantId: number, statusId: number): Observable<void> {
    return this.httpClient.get<void>(`${this.address}/changeApplicantStatus/${applicantId}/${statusId}`)
  }

  saveDescription(applicantId: number, description: string): Observable<any> {
    return this.httpClient.get(`${this.address}/saveDescription/${applicantId}?description=${description}`)
  }
}
