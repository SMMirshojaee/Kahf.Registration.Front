import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, ViewChild, inject } from '@angular/core';
import { RegCostService } from '@app/core/admin/reg-cost-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegCostDto } from '@app/share/models/reg.dto';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize, forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ApplicantOrderDto } from '@app/share/models/payment.dto';
import { ApplicantService } from '@app/core/applicant-service';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './manage-costs.html',
  styleUrl: './manage-costs.scss',
  providers: [ConfirmationService]
})
export class ManageCosts extends GenericComponent {
  private regCostService = inject(RegCostService);
  private confirmationService = inject(ConfirmationService);
  private applicantService = inject(ApplicantService);
  private regId: number;
  protected costsToEdit: RegCostDto[];
  protected fixedCosts: RegCostDto[];
  protected totalCost: number;
  protected costInputsDisable = true;
  protected searchValue = '';
  @ViewChild('dt1') private table: Table;
  protected applicants: ApplicantOrderDto[];

  ngOnInit() {
    this.regId = this.activatedRoute.snapshot.params['regId'];
    this.spinnerService.show();
    forkJoin({
      regCosts: this.regCostService.getByRegId(this.regId),
      applicants: this.applicantService.getWithOrders(this.regId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.fixedCosts = data.regCosts;
          this.costsToEdit = data.regCosts;
          this.totalCost = this.fixedCosts.map(e => e.amount).reduce((val, sum) => sum += val, 0);
          this.applicants = data.applicants;
          this.prepareDataToShow();
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  openSignInmodal(event: Event, applicant: ApplicantOrderDto) {
    let link = `${window.location.origin}/applicant/signin/${this.regId}?nc=${applicant.nationalNumber}&pn=${applicant.phoneNumber}&tc=${applicant.trackingCode}`;
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      header: 'این لینک رو توی incognito کپی کن.',
      message: link,
      icon: 'pi pi-info-triangle',
      rejectButtonProps: {
        label: 'بازکردن در همین پنجره',
        severity: 'danger',
        outlined: true
      },
      acceptLabel: 'کپی لینک',
      reject: () => {
        window.location.href = link
      },
      accept: () => {
        navigator.clipboard.writeText(link);
        this.notify.info('لینک کپی شد')
      },
    })
  }
  prepareDataToShow() {
    this.applicants.forEach(applicant => {
      applicant.fullName = `${applicant.firstName} - ${applicant.lastName}`;
      applicant.totalCost = this.fixedCosts.map(e => e.amount).reduce((val, sum) => sum += val, 0) * (applicant.membersCount + 1);
      applicant.totalLoan = applicant.orders.filter(e => e.authority == "LOAN").map(e => e.amount).reduce((val, sum) => sum += val, 0);
      applicant.totalCash = applicant.orders.filter(e => e.authority !== "LOAN").map(e => e.amount).reduce((val, sum) => sum += val, 0);
      applicant.remained = applicant.totalCost - applicant.totalCash - applicant.totalLoan;
    })
  }
  openChangeCostsModal(event: Event) {
    this.confirmationService.confirm({
      key: 'costChangeConfirmation',
      message: 'آیا از تغییر مقادیر مطمئنی؟ با این کار وضعیت تمام کاربران تغییر میکنه ها!',
      rejectLabel: 'انصراف',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'بله',
      accept: () => {
        this.notify.warn('فعلا پیاده سازی نشده');
        this.costInputsDisable = true;
      },
      reject: () => this.costInputsDisable = true,
      target: event.target
    })
  }
  clear() {
    this.table.clear()
    this.searchValue = ''
  }

  exportToExcel(table: Table): void {
    if (!table) return;

    let htmlTable = table.el.nativeElement as HTMLTableElement
    const data: string[][] = [];

    const rows = htmlTable.querySelectorAll('tr');
    rows.forEach((row) => {
      const rowData: string[] = [];
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell) => {
        const value = cell.textContent?.trim() || '';
        rowData.push(value); // مقدار به عنوان رشته push میشه
      });
      data.push(rowData);
    });

    // ساخت شیت به صورت دستی با مقدارهای متنی
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    // حالا اطمینان حاصل می‌کنیم که همه سلول‌ها text هستند
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell) {
          cell.t = 's';     // type string
          cell.z = '@';     // format text
          cell.v = cell.v.toString(); // تبدیل به رشته
        }
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'export.xlsx');
  }
  convertToEnglishDigits(event: any): void {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    event.target.value = event.target.value.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
  }
}
