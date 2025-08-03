import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, ViewChild, inject } from '@angular/core';
import { ApplicantService } from '@app/core/applicant-service';
import { FieldService } from '@app/core/field-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantWithFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { Table } from 'primeng/table';
import { finalize, forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PersianDatePipe } from '@app/share/persian-date-pipe';
import { RegStepService } from '@app/core/reg-step-service';
import { FieldDto } from '@app/share/models/field.dto';
import { FieldTypeEnum } from '@app/share/models/field-type.enum';
import { ConfirmationService } from 'primeng/api';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, PersianDatePipe],
  templateUrl: './full-view.html',
  styleUrl: './full-view.scss',
  providers:[ConfirmationService]
})
export class FullView extends GenericComponent {
  private applicantService = inject(ApplicantService);
  private fieldService = inject(FieldService);
  private regStepService = inject(RegStepService);
  private confirmationService = inject(ConfirmationService);
  private regId: number;
  protected applicants: ApplicantWithFormValueDto[];
  protected searchValue: string;
  protected fields: FieldDto[];
  protected FIELD_TYPE_ENUMS = FieldTypeEnum;

  @ViewChild('dt1') private table: Table;
  ngOnInit() {
    this.spinnerService.show();
    this.regId = this.activatedRoute.snapshot.params['regId'];
    forkJoin({
      leaders: this.applicantService.getLeadersFullDataByRegId(this.regId),
      fields: this.fieldService.getAll(this.regId),
      steps: this.regStepService.getByRegId(this.regId)
    }).pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.applicants = data.leaders;
          this.fields = data.fields;
          let steps = data.steps;
          this.applicants.forEach(applicant => {
            applicant.stepTitle = steps.find(e => e.id == applicant.status?.regStepId)?.title;
            applicant.applicantFormValues.forEach(value => {
              let field = this.fields.find(e => e.id == value.fieldId);
              if (field.fieldTypeId == FieldTypeEnum.Image)
                return;
              if (field.fieldTypeId == FieldTypeEnum.CheckBox) {
                if (!applicant[`field_${value.fieldId}`])
                  applicant[`field_${value.fieldId}`] = '';
                applicant[`field_${value.fieldId}`] += field.fieldOptions.find(e => e.id == value.fieldOptionId)?.title + ',';
              } else if (value.fieldOptionId) {
                applicant[`field_${value.fieldId}`] = field.fieldOptions.find(e => e.id == value.fieldOptionId)?.title;
              } else
                applicant[`field_${value.fieldId}`] = value.value;
            });
            applicant.inverseLeader.forEach(member => {
              member.applicantFormValues.forEach(value => {
                let field = this.fields.find(e => e.id == value.fieldId);
                if (field.fieldTypeId == FieldTypeEnum.Image)
                  return;
                if (field.fieldTypeId == FieldTypeEnum.CheckBox) {
                  if (!member[`field_${value.fieldId}`])
                    member[`field_${value.fieldId}`] = '';
                  member[`field_${value.fieldId}`] += field.fieldOptions.find(e => e.id == value.fieldOptionId)?.title + ',';
                } else if (value.fieldOptionId) {
                  member[`field_${value.fieldId}`] = field.fieldOptions.find(e => e.id == value.fieldOptionId)?.title;
                } else
                  member[`field_${value.fieldId}`] = value.value;
              });
            });
          });
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  clear() {
    this.table.clear()
    this.searchValue = ''
  }
  openSignInmodal(event: Event, applicant: ApplicantWithFormValueDto) {
    let link = `${window.location.origin}/applicant/signin/${applicant.regId}?nc=${applicant.nationalNumber}&pn=${applicant.phoneNumber}&tc=${applicant.trackingCode}`;
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
  exportToExcel(): void {

    let htmlTable = this.table.el.nativeElement as HTMLTableElement
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
}
