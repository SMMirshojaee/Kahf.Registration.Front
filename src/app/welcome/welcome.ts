import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RegService } from '@app/core/reg-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegDto } from '@app/share/models/reg.dto';
import { RegTile } from '@app/share/reg-tile/reg-tile';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule, SHARE_IMPORTS, RegTile],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome extends GenericComponent {
  private regService = inject(RegService);
  protected regs: RegDto[];
  protected description!: SafeHtml;
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    let regId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    if (!regId)
      this.regService.getActiveRegs()
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: (data) => {
            this.regs = data;
          }, error: (err) => {
            this.notify.error('خطا در دریافت اطلاعات');
          }
        })
    else
      this.regService.getById(regId)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: (data) => {
            this.regs = [data];
          }, error: (err: HttpErrorResponse) => {
            if (err.status == 404)
              this.notify.error('ثبت نام مورد نظر یافت نشد!');
            else
              this.notify.error('خطا در دریافت اطلاعات');
          }
        })
  }

}
