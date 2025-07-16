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
import { RegStepDto } from '@app/share/models/reg.dto';
import { PersianDatePipe } from '@app/share/persian-date-pipe';
import { Table } from 'primeng/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, PersianDatePipe],
  templateUrl: './view-form-step.html',
  styleUrl: './view-form-step.scss'
})
export class ViewFormStep extends GenericComponent {
  private applicantService = inject(ApplicantService);
  private fieldService = inject(FieldService);
  private regStepService = inject(RegStepService);
  private regStepId: number;
  protected applicants: ApplicantWithFormValueDto[];
  protected allFields: FieldDto[];
  protected fieldsToShow: FieldDto[];
  protected selectedRegStep: RegStepDto;
  protected searchValue: string;
  protected showChangeStatusDialog = false;
  protected selectedApplicant: ApplicantWithFormValueDto;
  private selectedApplicantIndex: number;
  protected newStatusId: number;
  protected showFormModal = false;
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  protected formData = {};

  @ViewChild('dt1') private table: Table;
  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      applicants: this.getApplicantsWithFormValues(),
      fields: this.getFields(),
      statuses: this.getRegStepStatuses()
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.applicants = data.applicants.filter(e => !e.leaderId);
          this.allFields = data.fields;
          this.selectedRegStep = data.statuses;
          this.checkForm();
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  gotoForm(applicant: ApplicantWithFormValueDto) {
    this.formData = {};
    this.formData['firstName'] = applicant.firstName;
    this.formData['lastName'] = applicant.lastName;
    this.formData['nationalNumber'] = applicant.nationalNumber;
    this.formData['phoneNumber'] = applicant.phoneNumber;

    this.fieldsToShow = this.allFields.filter(e => e.forLeader);
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
  openChangeStatusDialog(applicant: ApplicantWithFormValueDto, index: number) {
    this.selectedApplicant = applicant;
    this.selectedApplicantIndex = index;
    this.newStatusId = this.selectedApplicant.statusId;
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
    if (this.newStatusId == this.selectedApplicant.statusId) {
      this.notify.warn('وضعیت انتخاب شده با وضعیت قبلی یکی است');
      this.showChangeStatusDialog = false;
      return;
    }
    this.spinnerService.show();
    this.changeApplicantStatus()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.notify.defaultSuccess();
          this.applicants[this.selectedApplicantIndex].statusId = this.newStatusId;
          this.applicants[this.selectedApplicantIndex].status = this.selectedRegStep.regStepStatuses.find(e => e.id == this.newStatusId);
          this.showChangeStatusDialog = false;
          this.table.clear();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 500)
            return this.notify.defaultError();
          this.notify.error(err.error);
        }
      })

  }
  clear() {
    this.table.clear()
    this.searchValue = ''
  }
  getApplicantsWithFormValues() {
    return this.applicantService.getWithFormValuesWithRegStepId(this.regStepId);
  }
  getFields() {
    return this.fieldService.getAll(this.regStepId);
  }
  getRegStepStatuses() {
    return this.regStepService.getById(this.regStepId);
  }
  changeApplicantStatus() {
    return this.applicantService.changeApplicantStatus(this.selectedApplicant.id, this.newStatusId);
  }
}
