import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { ApplicantWithFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { ApplicantDto, ApplicantInfoDto, MemberInfoDto, SigninDto, SignupDto } from '@app/share/models/applicant.dto';
import { ApplicantOrderDto } from '@app/share/models/payment.dto';
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
  getMembersCount(): Observable<number> {
    return this.httpClient.get<number>(`${this.address}/getMembersCount`)
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

  getLeadersWithFormValuesAndMembersWithRegStepId(regStepId: number): Observable<ApplicantWithFormValueDto[]> {
    return this.httpClient.get<ApplicantWithFormValueDto[]>(`${this.address}/GetLeadersWithFormValuesAndMembersWithRegStepId/${regStepId}`)
  }

  getLeadersFullDataByRegId(regId: number): Observable<ApplicantWithFormValueDto[]> {
    return this.httpClient.get<ApplicantWithFormValueDto[]>(`${this.address}/getLeadersFullDataByRegId/${regId}`)
  }
  changeApplicantStatus(applicantId: number, statusId: number, sendSms: boolean, smsText: string): Observable<void> {
    smsText = sendSms ? smsText : null;
    return this.httpClient.put<void>(`${this.address}/changeApplicantStatus/${applicantId}/${statusId}/${sendSms}`, JSON.stringify(smsText), { headers: { 'Content-Type': 'application/json' } })
  }

  saveDescription(applicantId: number, description: string): Observable<any> {
    return this.httpClient.get(`${this.address}/saveDescription/${applicantId}?description=${description}`)
  }

  transferToNextStep(regStepId: number, currentStatusIds: number[], nextStatusId: number, sendSms: boolean, smsText: string): Observable<number> {
    let queryString = "";
    currentStatusIds.forEach((e, index) => {
      queryString += `ids=${e}`;
      if (index != currentStatusIds.length - 1)
        queryString += '&';
    });
    return this.httpClient.put<number>(`${this.address}/transferToNextStep/${regStepId}/${nextStatusId}/${sendSms}?${queryString}`, JSON.stringify(smsText), { headers: { 'Content-Type': 'application/json' } });
  }

  getWithOrders(regId: number): Observable<ApplicantOrderDto[]> {
    return this.httpClient.get<ApplicantOrderDto[]>(`${this.address}/getWithOrders/${regId}`);
  }
  removeExtraCost(id: number): Observable<any> {
    return this.httpClient.delete(`${this.address}/removeExtraCost/${id}`);
  }
}
