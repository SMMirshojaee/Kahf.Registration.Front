import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { RegService } from '@app/core/reg-service';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegDto } from '@app/share/models/reg.dto';
import { RegTile } from '../components/reg-tile/reg-tile';
import { GenericComponent } from '@app/share/generic-component';
import { finalize } from 'rxjs';
import { UserService } from '@app/core/admin/user-service';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, RegTile],
  templateUrl: './regs.html',
  styleUrl: './regs.scss'
})
export class Regs extends GenericComponent {
  private regService = inject(RegService);
  private userService = inject(UserService);
  protected regs: RegDto[];

  ngOnInit() {
    this.spinnerService.show();
    this.getRegs()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.regs = data;
        }, error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      });
  }
  sendSms() {
    this.userService.sendSms().subscribe({
      next: (data) => {

      }, error: (error: HttpErrorResponse) => {

      }
    });
  }
  getRegs() {

    return this.regService.getAll()

  }
}
