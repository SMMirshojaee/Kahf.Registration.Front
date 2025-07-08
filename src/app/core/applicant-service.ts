import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { SignupDto } from '@app/share/models/applicant.dto';
import { TokenDto } from '@app/share/models/token.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/applicant`;

  signup(signupDto: SignupDto): Observable<TokenDto> {
    return this.httpClient.post<TokenDto>(`${this.address}/signup`, signupDto)

  }
}
