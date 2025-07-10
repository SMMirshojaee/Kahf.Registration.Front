import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';
import { FormControl, Validators } from '@angular/forms';
import { Jalali } from 'jalali-ts';
import { IActiveDate } from 'ng-persian-datepicker';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  selector: 'field-date',
  templateUrl: './date.html',
  styleUrl: './date.scss'
})
export class DateField extends GenericField {
  @Input({ required: true }) field: FieldDto;@Input({ required: true }) formControl: FormControl;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto = new ApplicantFormValueDto();
  dateValue: FormControl;
  protected minDate: number;
  protected maxDate: number;
  ttt;
  ngOnInit() {
    this.dateValue = new FormControl('');
    if (this.field.mandatory)
      this.dateValue.addValidators(Validators.required);

    let minDateString = this.field.fieldOptions.find(e => e.type == 'MinDate');
    if (minDateString)
      this.minDate = Jalali.parse(minDateString.value).valueOf();


    let maxDateString = this.field.fieldOptions.find(e => e.type == 'MaxDate');
    if (maxDateString)
      this.maxDate = Jalali.parse(maxDateString.value).valueOf();


  }
  onSelect(date: IActiveDate) {
    debugger
  }
}
