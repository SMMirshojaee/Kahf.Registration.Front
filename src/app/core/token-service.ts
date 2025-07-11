import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegDto } from '@app/share/models/reg.dto';
import { ApplicantInfo } from '@app/share/models/token.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private route = inject(Router);

  private _applicantInfo: ApplicantInfo;
  private _selectedReg: RegDto;
  private _darkMode: boolean;

  logout() {
    localStorage.clear();
    this.route.navigate(['/']);
  }
  setTokenString(tokenString: string) {
    this._applicantInfo = null;
    localStorage.setItem('jwtToken', tokenString)
  }
  setSelectedReg(reg: RegDto) {
    this._selectedReg = reg;
    localStorage.setItem('selectedReg', JSON.stringify(reg))
  }
  setDarkMode(state: boolean) {
    this._darkMode = state;
    localStorage.setItem('dark-mode', state.toString())
  }
  setFormFields(applicantId: number, regStepId: number, values: any) {
    localStorage.setItem(`formFieldValues_${applicantId}_${regStepId}`, JSON.stringify(values));
  }

  getDarkMode(): boolean {
    if (!this._darkMode) {
      let raw = localStorage.getItem('dark-mode');
      if (raw?.toLowerCase() == 'true')
        this._darkMode = true;
      else
        this._darkMode = false;
    }
    return this._darkMode;
  }

  getTokenString(): string {
    return localStorage.getItem('jwtToken');
  }
  getSelectedReg(): RegDto {
    if (!this._selectedReg) {
      let raw = JSON.parse(localStorage.getItem('selectedReg'));
      if (!raw)
        return null;
      this._selectedReg = new RegDto(raw);
    }
    return this._selectedReg;
  }

  getApplicantInfo(): ApplicantInfo {
    if (!this._applicantInfo) {
      let tokenString = this.getTokenString();
      if (tokenString) {
        let rawInfo = jwtDecode<any>(tokenString);
        this._applicantInfo = new ApplicantInfo(rawInfo);
      } else {
        this._applicantInfo = null;
      }
    }
    return this._applicantInfo;
  }
  getActor(): string {
    let tokenString = this.getTokenString();
    if (tokenString) {
      let rawInfo = jwtDecode<any>(tokenString);
      return rawInfo['http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor'];
    }
    return null;
  }

}
