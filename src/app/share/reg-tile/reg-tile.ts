import { Component, Input, inject } from '@angular/core';
import { SHARE_IMPORTS } from '../imports';
import { RegDto } from '../models/reg.dto';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PersianDatePipe } from '../persian-date-pipe';
import { TokenService } from '@app/core/token-service';

@Component({
  selector: 'reg-tile',
  standalone: true,
  imports: [SHARE_IMPORTS, PersianDatePipe],
  templateUrl: './reg-tile.html',
  styleUrl: './reg-tile.scss'
})
export class RegTile {
  @Input() reg: RegDto;
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  protected description: SafeHtml;

  ngOnInit() {
    this.description = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.reg.description ?? ''));
  }
  route(address: string) {
    this.tokenService.setSelectedReg(this.reg);
    this.router.navigate([address]);
  }
  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
