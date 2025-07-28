import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@app/share/environment/environment';
import { RegCostDto } from '@app/share/models/reg.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegCostService {
  private httpClient = inject(HttpClient);
  private address = `${environment.baseApiAddress}/api/regCost`;

  getByRegId(regId: number) :Observable<RegCostDto[]>{
    return this.httpClient.get<RegCostDto[]>(`${this.address}/GetByRegId/${regId}`);
  }
}
