import { Component, Input, inject } from '@angular/core';
import { SHARE_IMPORTS } from '../imports';
import { RegDto } from '../models/reg.dto';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'reg-tile',
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './reg-tile.html',
  styleUrl: './reg-tile.scss'
})
export class RegTile {
  @Input() reg: RegDto;
  // private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  protected description: SafeHtml;

  ngOnInit() {
    // this.description = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.reg.description ?? ''));
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
