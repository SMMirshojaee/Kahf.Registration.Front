import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApplicantFormValueService } from '@app/core/applicant-form-value-service';
import { FieldService } from '@app/core/field-service';
import { FIELD_IMPORTS } from '@app/share/fields/fields-import';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldTypeEnum } from '@app/share/models/field-type.enum';
import { FieldDto } from '@app/share/models/field.dto';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';
import { Jalali } from 'jalali-ts';
import { ConfirmationService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, FIELD_IMPORTS],
  templateUrl: './fill-form.html',
  styleUrl: './fill-form.scss',
  providers: [ConfirmationService]
})
export class FillForm extends GenericComponent implements OnDestroy {
  private fieldService = inject(FieldService);
  private applicantFormValueService = inject(ApplicantFormValueService);
  private activatedRoute = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);
  private applicantId: number;
  private regStepId: number;
  protected fields: FieldDto[];
  protected values: ApplicantFormValueDto[];
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  protected formGroup: FormGroup;
  protected formControl: FormControl;

  private interval;
  ngOnDestroy() {
    clearInterval(this.interval);
    this.tokenService.setFormFields(this.applicantId, this.regStepId, this.formGroup.value);
  }
  ngOnInit() {
    this.applicantId = this.tokenService.getApplicantInfo().applicantid;
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      fields: this.fieldService.getByRegStepId(this.regStepId),
      values: this.applicantFormValueService.GetByRegStepId(this.regStepId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          let previousValues = data.values;
          this.fields = data.fields;
          this.formGroup = new FormGroup({});
          this.fields.forEach(field => {
            let previousValue = previousValues.filter(e => e.fieldId == field.id);
            let formControl = new FormControl();
            if (field.mandatory)
              formControl.addValidators(Validators.required);
            switch (field.fieldTypeId) {
              case FieldTypeEnum.CheckBox:
                let cbOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = cbOptions;
                if (previousValue) {
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
                if (previousValue) {
                  formControl.patchValue(Jalali.parse(previousValue[0].value).valueOf());
                }
                break;
              case FieldTypeEnum.DropDown:
                let ddOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = ddOptions;
                if (previousValue) {
                  formControl.patchValue(previousValue[0].fieldOptionId);
                }
                break;
              case FieldTypeEnum.Image:
                let maxSizeInMB = 3;
                let maxSizeInMBOption = field.fieldOptions.find(e => e.type == 'MaxSizeInMB');
                if (maxSizeInMBOption)
                  maxSizeInMB = parseInt(maxSizeInMBOption.value);
                field.maxSizeInMB = maxSizeInMB
                break;
              case FieldTypeEnum.Radio:
                let rOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = rOptions;
                if (previousValue) {
                  formControl.patchValue(previousValue[0].fieldOptionId);
                }
                break;
              case FieldTypeEnum.Mobile:
                formControl.addValidators(MobileValidator);
                if (previousValue) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.NationalCode:
                formControl.addValidators(NationalCodeValidator);
                if (previousValue) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.Text:
                formControl.addValidators(Validators.maxLength(500));
                if (previousValue) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
              case FieldTypeEnum.TextArea:
                formControl.addValidators(Validators.maxLength(2000))
                if (previousValue) {
                  formControl.patchValue(previousValue[0].value);
                }
                break;
            }
            this.formGroup.addControl(`field_${field.id}`, formControl);
          });
          this.values = data.values;
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
    this.applicantFormValueService.insert(this.applicantId, this.regStepId, applicantFormValues)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          clearInterval(this.interval);
          // this.notify.success('اطلاعات شما با موفقیت ثبت شد. با ما در ارتباط باشید');
          let message = data ? `کد رهگیری ثبت نام شما: ${data}. این کد را نزد خود نگه دارید. برای پیگیری فرایند های ثبت نام به این کد نیاز دارید` :
            '';
          this.confirmationService.confirm({
            message: message,
            header: 'اطلاعات شما با موفقیت ثبت شد',
            icon: 'pi pi-info-circle',
            closable: false,
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonProps: {
              label: 'برو به داشبورد',
              severity: 'primary',
              text: false
            },
            accept: () => {
              this.route('dashboard');
            }
          })
          imageFields.forEach(imageField => {
            this.applicantFormValueService.upload(imageField.fileName, imageField.imageFile)
              .subscribe({
                next: () => { },
                error: () => { this.notify.error('خطا در بارگذاری عکس!') }
              });
          })
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 300)
            this.notify.error('شما قبلا این فرم را پر کرده اید!');
        }
      })
  }
  generateRandomText(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
