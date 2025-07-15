import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegDto } from '@app/share/models/reg.dto';

@Component({
  selector: 'admin-reg-tile',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './reg-tile.html',
  styleUrl: './reg-tile.scss'
})
export class RegTile {
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  protected description: SafeHtml;
  @Input({ required: true }) reg: RegDto;

  ngOnInit() {
    this.description = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.reg.description ?? ''));
  }
  route(address: string) {
    this.router.navigate([address]);
  }
  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
