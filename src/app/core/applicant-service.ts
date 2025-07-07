import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { SignupDto } from '@app/share/models/applicant.dto';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/applicant`;

  signup(signupDto: SignupDto) {
    return this.httpClient.post(`${this.address}/signup`, signupDto)

  }
}
