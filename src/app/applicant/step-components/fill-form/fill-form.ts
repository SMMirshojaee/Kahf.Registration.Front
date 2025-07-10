import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
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
import { IActiveDate } from 'ng-persian-datepicker';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, FIELD_IMPORTS],
  templateUrl: './fill-form.html',
  styleUrl: './fill-form.scss'
})
export class FillForm extends GenericComponent {
  private fieldService = inject(FieldService);
  private applicantFormValueService = inject(ApplicantFormValueService);
  private activatedRoute = inject(ActivatedRoute);
  private regStepId: number;
  protected fields: FieldDto[];
  protected values: ApplicantFormValueDto[];
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  protected formGroup: FormGroup;
  protected formControl: FormControl;
  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      fields: this.fieldService.getByRegStepId(this.regStepId),
      values: this.applicantFormValueService.GetByRegStepId(this.regStepId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.fields = data.fields;
          this.formGroup = new FormGroup({});
          this.fields.forEach(field => {
            let formControl = new FormControl();
            if (field.mandatory)
              formControl.addValidators(Validators.required);
            switch (field.fieldTypeId) {
              case FieldTypeEnum.CheckBox:
                let cbOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = cbOptions;
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
                break;
              case FieldTypeEnum.DropDown:
                let ddOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = ddOptions;
                break;
              case FieldTypeEnum.Image:
                let maxSizeInMB = 5;
                let maxSizeInMBOption = field.fieldOptions.find(e => e.type == 'MaxSizeInMB');
                if (maxSizeInMBOption)
                  maxSizeInMB = parseInt(maxSizeInMBOption.type);
                break;
              case FieldTypeEnum.Radio:
                let rOptions = field.fieldOptions.filter(e => e.type == 'Option');
                field.optionsToShow = rOptions;
                break;
              case FieldTypeEnum.Mobile:
                formControl.addValidators(MobileValidator);
                break;
              case FieldTypeEnum.NationalCode:
                formControl.addValidators(NationalCodeValidator);
                break;
              case FieldTypeEnum.Text:
                formControl.addValidators(Validators.maxLength(500));
                break;
              case FieldTypeEnum.TextArea:
                formControl.addValidators(Validators.maxLength(2000))
                break;
            }
            this.formGroup.addControl(`field_${field.id}`, formControl);
          });
          this.values = data.values;
        }, error: (err: HttpErrorResponse) => {

        }
      })
  }
  onDateSelect(date: IActiveDate) {
  }

  submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.notify.warn('موارد مشخص شده را رفع نمایید');
      return;
    }

  }
}
