import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicantFormValueService } from '@app/core/applicant-form-value-service';
import { FieldService } from '@app/core/field-service';
import { environment } from '@app/share/environment/environment';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { MemberInfoDto } from '@app/share/models/applicant.dto';
import { FieldTypeEnum } from '@app/share/models/field-type.enum';
import { FieldDto } from '@app/share/models/field.dto';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';
import { Jalali } from 'jalali-ts';
import { ConfirmationService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './fill-form.html',
  styleUrl: './fill-form.scss',
  providers: [ConfirmationService]
})
export class FillForm extends GenericComponent implements OnDestroy {
  private fieldService = inject(FieldService);
  private applicantFormValueService = inject(ApplicantFormValueService);
  private confirmationService = inject(ConfirmationService);
  private applicantId: number;
  protected memberId?: number;
  private regStepId: number;
  protected fields: FieldDto[];
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  protected formGroup: FormGroup;
  protected formControl: FormControl;
  protected formIsDisable = false;
  protected showInfoModal = false;
  protected informationModal: { value?: string, title: string, id: number };
  private interval;

  protected baseData: { firstName: string, lastName: string, nationalCode: string }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.tokenService.setFormFields(this.applicantId, this.regStepId, this.formGroup.value);
  }
  ngOnInit() {
    const applicantInfo = this.tokenService.getApplicantInfo();
    this.applicantId = applicantInfo.applicantid;
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.memberId = this.activatedRoute.snapshot.params['memberId'];
    let disable = this.activatedRoute.snapshot.params['disable'];
    if (disable.toLowerCase() == 'true')
      this.formIsDisable = true;
    if (!this.memberId) {
      this.baseData = {
        firstName: applicantInfo.firstName,
        lastName: applicantInfo.lastName,
        nationalCode: applicantInfo.nationalcode
      }
    } else {
      const memberData = JSON.parse(localStorage.getItem('baseData')) as MemberInfoDto;
      if (memberData)
        this.baseData = {
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          nationalCode: memberData.nationalNumber
        }
    }
    this.spinnerService.show();
    forkJoin({
      fields: this.fieldService.getByRegStepId(this.regStepId, this.memberId),
      values: this.applicantFormValueService.GetByRegStepId(this.regStepId, this.memberId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          let previousValues = data.values;
          this.formIsDisable ||= previousValues?.length > 0;
          this.fields = data.fields;
          this.formGroup = new FormGroup({});

          this.fields.forEach(field => {
            let previousValue = previousValues?.filter(e => e.fieldId == field.id);
            let formControl = new FormControl();
            if (field.mandatory)
              formControl.addValidators(Validators.required);
            switch (field.fieldTypeId) {
              case FieldTypeEnum.CheckBox:
                let cbOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = cbOptions;
                if (previousValue.length) {
                  let value = previousValue.map(e => e.fieldOptionId);
                  formControl.patchValue(value);
                }
                break;
              case FieldTypeEnum.Date:
                let minDateString = field.fieldOptions.find(e => e.type == 'MinDate');
                if (minDateString) {
                  let minDate = Jalali.parse(minDateString.value).valueOf();
                  field.minDate = minDate;
                }
                let maxDateString = field.fieldOptions.find(e => e.type == 'MaxDate');
                if (maxDateString) {
                  let maxDate = Jalali.parse(maxDateString.value).valueOf();
                  field.maxDate = maxDate;
                }
                if (previousValue.length) {
                  try {
                    let date = Jalali.gregorian(previousValue[0].value).valueOf()
                    formControl.patchValue(date);
                  } catch (error) {
                  }
                }
                break;
              case FieldTypeEnum.DropDown:
                let ddOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = ddOptions;
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].fieldOptionId);
                }
                break;
              case FieldTypeEnum.Image:
                let maxSizeInMB = 3;
                let maxSizeInMBOption = field.fieldOptions.find(e => e.type == 'MaxSizeInMB');
                if (maxSizeInMBOption)
                  maxSizeInMB = parseInt(maxSizeInMBOption.value);
                field.maxSizeInMB = maxSizeInMB;
                if (previousValue.length) {
                  field.imageSource = `${environment.repositoryAddress}/${(this.memberId ?? this.applicantId)}/${previousValue[0].value}`;
                }
                break;
              case FieldTypeEnum.Radio:
                let rOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = rOptions;
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].fieldOptionId);
                }
                break;
              case FieldTypeEnum.Mobile:
                formControl.addValidators(MobileValidator);
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.NationalCode:
                formControl.addValidators(NationalCodeValidator);
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.Text:
                formControl.addValidators(Validators.maxLength(500));
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.TextArea:
                formControl.addValidators(Validators.maxLength(2000))
                if (previousValue.length) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
            }
            this.formGroup.addControl(`field_${field.id}`, formControl);
          });
          if (this.formIsDisable)
            this.formGroup.disable();
        }, error: (err: HttpErrorResponse) => {

        }
      });
    let counter = 0
    this.interval = setInterval(() => {
      console.log(`interval_${counter}`);
      if (counter++ > 10) {
        console.log(`clear interval`);
        clearInterval(this.interval);
        return;
      }
      if (this.formGroup?.value)
        this.tokenService.setFormFields(this.applicantId, this.regStepId, this.formGroup.value);
    }, 60_000)
  }

  async imageSelected(event: Event, field: FieldDto) {
    const input = event.target as HTMLInputElement;
    let files = input.files;

    if (files[0].size > field.maxSizeInMB * 1024 * 1024) {
      this.notify.warn(`حجم فایل نباید بیشتر از ${field.maxSizeInMB} مگابایت باشد`);
      return;
    }
    field.imageBase64 = null;
    if (files && files.length) {
      let image = files[0];
      field.imageBase64 = await this.fileToBase64(image);
      field.imageFile = image;
      let extension = image.name.split('.')[image.name.split('.').length - 1];
      field.fileName = `${this.regStepId}__${field.id}__${this.generateRandomText(10)}.${extension}`;
    }
  }
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  checkForm() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsDirty();
      this.notify.warn('موارد مشخص شده را رفع نمایید');
      return;
    }
    this.confirmationService.confirm({
      message: 'آیا از صحت اطلاعاتی که وارد کردید مطمئن هستید؟',
      key: 'submitConfirmModal',
      header: 'تایید نهایی',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonProps: {
        label: 'بله',
        severity: 'primary',
        text: false
      },
      rejectButtonProps: {
        label: 'خیر',
        severity: 'secondary',
        text: false,
      },
      accept: () => {
        clearInterval(this.interval);
        this.tokenService.setFormFields(this.applicantId, this.regStepId, this.formGroup.value);
        this.submitForm();
      }
    });
  }
  submitForm() {
    let imageFields: FieldDto[] = [];
    let applicantFormValues: ApplicantFormValueDto[] = [];
    this.fields.forEach(field => {
      let fieldValue = this.formGroup.value[`field_${field.id}`];
      if (!fieldValue)
        return;
      switch (field.fieldTypeId) {
        case FieldTypeEnum.CheckBox:
          fieldValue.forEach(value => {
            let option = field.fieldOptions.find(e => e.id == value);
            if (option) {
              applicantFormValues.push({
                applicantId: this.applicantId,
                fieldId: field.id,
                fieldOptionId: option.id,
                value: null,
                deleted: false,
              } as ApplicantFormValueDto)
            }
          });
          break;
        case FieldTypeEnum.Date:
          let date = Jalali.parse(fieldValue).gregorian();
          applicantFormValues.push({
            applicantId: this.applicantId,
            fieldId: field.id,
            fieldOptionId: null,
            value: date,
            deleted: false,
          } as ApplicantFormValueDto)
          break;
        case FieldTypeEnum.Radio:
        case FieldTypeEnum.DropDown:
          applicantFormValues.push({
            applicantId: this.applicantId,
            fieldId: field.id,
            fieldOptionId: fieldValue,
            value: null,
            deleted: false,
          } as ApplicantFormValueDto)
          break;
        case FieldTypeEnum.Image:
          applicantFormValues.push({
            applicantId: this.applicantId,
            fieldId: field.id,
            fieldOptionId: null,
            value: field.fileName,
            deleted: false,
          } as ApplicantFormValueDto);
          imageFields.push(field);
          break;
        case FieldTypeEnum.Mobile:
        case FieldTypeEnum.NationalCode:
        case FieldTypeEnum.Text:
        case FieldTypeEnum.TextArea:
          applicantFormValues.push({
            applicantId: this.applicantId,
            fieldId: field.id,
            fieldOptionId: null,
            value: fieldValue,
            deleted: false,
          } as ApplicantFormValueDto)
          break;
      }
    });
    if (applicantFormValues.length == 0) {
      this.notify.warn('هیچ فیلدی جهت ثبت وجود ندارد!');
      return;
    }
    this.spinnerService.show();
    this.applicantFormValueService.insert(this.regStepId, applicantFormValues, this.memberId)
      // .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          clearInterval(this.interval);
          // this.notify.success('اطلاعات شما با موفقیت ثبت شد. با ما در ارتباط باشید');
          if (imageFields.length) {
            this.notify.info('در حال بارگذاری عکس ها...');
            let uploads = [];
            imageFields.forEach(imageField => {
              uploads.push(this.applicantFormValueService.upload(imageField.fileName, imageField.imageFile, this.memberId))
            })
            forkJoin(uploads)
              .pipe(finalize(() => this.showFinal(data)))
              .subscribe({
                next: () => { },
                error: () => { this.notify.error('خطا در بارگذاری عکس!') }
              })
          } else {

            this.showFinal(data)
          }
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 300)
            this.notify.error('شما قبلا این فرم را پر کرده اید!');
          this.spinnerService.hide()
        }
      })
  }
  showFinal(trackingCode: string) {
    this.spinnerService.hide();
    let message = trackingCode ? `کد رهگیری ثبت نام شما: ${trackingCode}. این کد را نزد خود نگه دارید. برای پیگیری فرایند های ثبت نام به این کد نیاز دارید` :
      '';
    this.confirmationService.confirm({
      message: message,
      key: 'submitConfirmModal',
      header: 'اطلاعات شما با موفقیت ثبت شد',
      icon: 'pi pi-check-circle',
      closable: false,
      rejectVisible: false,
      acceptButtonProps: {
        label: 'برو به داشبورد',
        severity: 'primary',
        text: false
      },
      accept: () => {
        this.route('/applicant/dashboard');
      }
    })
  }
  convertToEnglishDigits(event: any, fieldId: number): void {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';

    event.target.value = event.target.value.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
    // اگر از FormControl استفاده می‌کنی، مقدار رو هم به‌روز کن:
    this.formGroup.controls[`field_${fieldId}`].setValue(event.target.value, { emitEvent: false });
  }

  openInfoModal(information: { value?: string, title: string, id: number }) {
    this.informationModal = information;
    this.showInfoModal = true;
  }
  private generateRandomText(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

}
