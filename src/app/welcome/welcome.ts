import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RegService } from '@app/core/reg-service';
import { SHARE_IMPORTS } from '@app/share/imports';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule, SHARE_IMPORTS],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  private regService = inject(RegService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  protected description!: SafeHtml;
  route(address: string) {
    this.router.navigate([address])
  }

  ngOnInit() {
    this.regService.getDefault().subscribe({
      next: (data) => {
        this.description =this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(data.description ?? ''));
      }, error: (err) => {

      }
    })
  }
  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
