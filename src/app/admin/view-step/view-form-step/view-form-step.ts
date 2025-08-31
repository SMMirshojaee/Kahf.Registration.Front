import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, ViewChild, inject } from '@angular/core';
import { ApplicantService } from '@app/core/applicant-service';
import { FieldService } from '@app/core/field-service';
import { RegStepService } from '@app/core/reg-step-service';
import { environment } from '@app/share/environment/environment';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantWithFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldTypeEnum } from '@app/share/models/field-type.enum';
import { FieldDto } from '@app/share/models/field.dto';
import { RegStepDto, RegStepStatusDto } from '@app/share/models/reg.dto';
import { PersianDatePipe } from '@app/share/persian-date-pipe';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize, forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SmsService } from '@app/core/sms-service';
import { SmsStatusPipe } from '@app/share/sms-status-pipe';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, PersianDatePipe, SmsStatusPipe],
  templateUrl: './view-form-step.html',
  styleUrl: './view-form-step.scss',
  providers: [ConfirmationService]
})
export class ViewFormStep extends GenericComponent {

  private applicantService = inject(ApplicantService);
  private fieldService = inject(FieldService);
  private regStepService = inject(RegStepService);
  private confirmationService = inject(ConfirmationService);
  private smsService = inject(SmsService);
  private regStepId: number;
  private regId: number;
  protected applicants: ApplicantWithFormValueDto[];
  private members: ApplicantWithFormValueDto[];
  protected allFields: FieldDto[];
  protected fieldsToShow: FieldDto[];
  protected selectedRegStep: RegStepDto;
  protected searchValue: string;
  protected showChangeStatusDialog = false;
  protected selectedApplicant: ApplicantWithFormValueDto;
  private selectedApplicantIndex: number;
  protected newStatusId: number;
  protected showFormModal = false;
  protected isMember = false;
  protected showMembersDialog = false;
  protected showTransferModal = false;
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  protected formData = {};
  protected applicantDescription = '';
  protected sendSmsCheckbox = false;
  protected smsText = 'زائر گرامی. لطفا جهت مشاهده وضعیت خود، به سامانه ثبت‌نام مراجعه نمایید. با تشکر کهف الحصین';
  protected nextStep: RegStepDto;
  protected nextStatusId: number;
  protected showMessageModal: boolean;
  protected smsPanelIsOpen = false;
  protected checkAll = false;
  protected acceptedStatuses: RegStepStatusDto[];
  protected selectedStatusesForTransfer: number[];

  @ViewChild('dt1') private table: Table;
  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['regStepId'];
    this.regId = this.activatedRoute.snapshot.params['regId'];
    this.spinnerService.show();
    forkJoin({
      applicants: this.getApplicantsWithFormValues(),
      fields: this.getFields(),
      statuses: this.getRegStepStatuses(),
      nextStep: this.regStepService.getNextStep(this.regStepId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.applicants = data.applicants.filter(e => !e.leaderId);
          this.members = [...this.applicants.flatMap(e => e.inverseLeader)];
          this.allFields = data.fields;
          this.selectedRegStep = data.statuses;
          this.acceptedStatuses = this.selectedRegStep.regStepStatuses.filter(e => e.isAccepted);
          this.selectedStatusesForTransfer = this.acceptedStatuses.map(e => e.id);
          this.nextStep = data.nextStep;
          this.checkForm();
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  openMembersDialog(applicant: ApplicantWithFormValueDto) {
    this.selectedApplicant = applicant;

    this.showMembersDialog = true;
  }
  gotoForm(applicant: ApplicantWithFormValueDto, isMember: boolean = false) {
    this.isMember = isMember;
    this.applicantDescription = applicant.description;
    this.formData = {};
    this.formData['id'] = applicant.id;
    this.formData['firstName'] = applicant.firstName;
    this.formData['lastName'] = applicant.lastName;
    this.formData['nationalNumber'] = applicant.nationalNumber;
    this.formData['phoneNumber'] = applicant.phoneNumber;
    if (isMember) {
      let member = this.members.find(e => e.id == applicant.id);
      applicant.applicantFormValues = member.applicantFormValues;
    }
    this.fieldsToShow = this.allFields.filter(e => e.forLeader);
    if (isMember)
      this.fieldsToShow = this.allFields.filter(e => e.forMember);

    this.fieldsToShow.forEach(field => {
      let answers = applicant.applicantFormValues.filter(e => e.fieldId == field.id);
      if (!answers || answers.length == 0) {
        this.formData[`${field.id}`] = null;
        return;
      }
      if (field.fieldTypeId == FieldTypeEnum.Radio || field.fieldTypeId == FieldTypeEnum.DropDown) {
        let answerOption = field.fieldOptions.find(e => e.id == answers[0].fieldOptionId);
        this.formData[`${field.id}`] = answerOption?.title;
      } else if (field.fieldTypeId == FieldTypeEnum.CheckBox) {
        let answerText = '';
        answers.forEach(answer => {
          let answerOption = field.fieldOptions.find(e => e.id == answer.fieldOptionId);
          answerText += answerOption?.title + ' , ';
        });
        this.formData[`${field.id}`] = answerText;
      } else if (field.fieldTypeId == FieldTypeEnum.Image) {
        this.formData[`${field.id}`] = `${environment.repositoryAddress}/${applicant.id}/${answers[0].value}`;
      }
      else
        this.formData[`${field.id}`] = answers[0]?.value;
    });

    this.showFormModal = true;
  }
  saveDescription(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'از ثبت توضیحات برای کاربر مطمئن هستی؟',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'انصراف',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'بله',
        severity: 'primary'
      },
      accept: () => {
        let applicantId = this.formData['id'];
        this.spinnerService.show();
        this.applicantService.saveDescription(applicantId, this.applicantDescription)
          .pipe(finalize(() => this.spinnerService.hide()))
          .subscribe({
            next: data => {
              this.notify.defaultSuccess();
              this.ngOnInit()
            },
            error: (err: HttpErrorResponse) => {
              this.notify.defaultError();
            }
          })
      },
      reject: () => {
      }
    });
  }
  openTransferModal() {
    this.showTransferModal = true;
  }
  openChangeStatusDialog(applicant: ApplicantWithFormValueDto, index: number) {
    this.selectedApplicant = applicant;
    this.selectedApplicantIndex = index;
    this.newStatusId = this.selectedApplicant.statusId;
    this.smsText = 'زائر گرامی. لطفا جهت مشاهده وضعیت خود، به سامانه ثبت‌نام مراجعه نمایید. با تشکر کهف الحصین';
    this.sendSmsCheckbox = false;
    this.showChangeStatusDialog = true;
  }
  checkForm() {
    let mandatoryFields = this.allFields.filter(e => e.mandatory && e.forLeader);
    this.applicants.forEach(applicant => {
      let answeredFieldIds = applicant.applicantFormValues.map(e => e.fieldId);
      applicant.notFilledMandoryFields = mandatoryFields.filter(item => !answeredFieldIds.includes(item.id))
    })
  }
  changeStatus() {
    if (this.newStatusId == this.selectedApplicant.statusId && !this.sendSmsCheckbox) {
      this.notify.warn('وضعیت انتخاب شده با وضعیت قبلی یکی است');
      this.showChangeStatusDialog = false;
      return;
    }
    if (this.sendSmsCheckbox && !this.smsText) {
      this.notify.warn('متن پیامک نمیتواند خالی باشد');
      return;
    }
    this.spinnerService.show();
    this.changeApplicantStatus()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: () => {
          this.notify.defaultSuccess();
          this.applicants[this.selectedApplicantIndex].statusId = this.newStatusId;
          this.applicants[this.selectedApplicantIndex].status = this.selectedRegStep.regStepStatuses.find(e => e.id == this.newStatusId);
          this.showChangeStatusDialog = false;
          this.table.clear();
          this.ngOnInit();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 500)
            return this.notify.defaultError();
          this.notify.error(err.error);
        }
      })

  }
  transfer() {
    if (!this.selectedStatusesForTransfer?.length) {
      this.notify.warn('انتخاب حداقل یک وضعیت از مرحله کنونی الزامی است!');
      return
    }
    if (!this.nextStatusId) {
      this.notify.warn('وضعیت بعدی انتخاب نشده است!');
      return
    }
    if (this.sendSmsCheckbox && !this.smsText) {
      this.notify.warn('متن پیامک نمیتواند خالی باشد');
      return;
    }
    this.spinnerService.show();
    this.applicantService.transferToNextStep(this.regStepId, this.selectedStatusesForTransfer, this.nextStatusId, this.sendSmsCheckbox, this.smsText)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: count => {
          this.nextStatusId = null;
          this.notify.success(`تعداد ${count} کاربر منتقل شدند`);
          this.showTransferModal = false;
          this.ngOnInit();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 400)
            return this.notify.error(err.error);
          this.notify.defaultError();
        }
      })

  }
  clear() {
    this.table.clear()
    this.searchValue = ''
  }

  openMessagesModal(applicant: ApplicantWithFormValueDto) {
    this.showMessageModal = true;
    this.selectedApplicant = applicant;
  }
  showSmsModal() {
    this.smsPanelIsOpen = !this.smsPanelIsOpen;
  }
  checkAllChanged(table: Table) {
    debugger
    if (!this.checkAll)
      this.applicants.forEach(app => app.isCheck = false)
    else {
      if (table.filteredValue)
        table.filteredValue.forEach(e => {
          let applicant = this.applicants.find(ap => ap.id == e.id);
          applicant.isCheck = this.checkAll;
        });
      else
        this.applicants.forEach(e => e.isCheck = this.checkAll);
    }
  }
  sendSms() {
    let checkedIds = this.applicants.filter(e => e.isCheck).map(e => e.id);
    if (!(checkedIds?.length > 0)) {
      return this.notify.warn('هیچ زائری انتخاب نشده است')
    }
    if (!this.smsText)
      return this.notify.warn('متن پیامک نمی تواند خالی باشد');
    this.spinnerService.show();

    this.smsService.send(this.smsText, checkedIds)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.notify.success('پیامک ها با موفقیت ارسال شدند')
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })

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

  getApplicantsWithFormValues() {
    return this.applicantService.getLeadersWithFormValuesAndMembersWithRegStepId(this.regStepId);
  }
  getFields() {
    return this.fieldService.getAll(this.regId);
  }
  getRegStepStatuses() {
    return this.regStepService.getById(this.regStepId);
  }
  changeApplicantStatus() {
    return this.applicantService.changeApplicantStatus(this.selectedApplicant.id, this.newStatusId, this.sendSmsCheckbox, this.smsText);
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
}
