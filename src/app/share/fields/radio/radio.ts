import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';
import { FormControl } from '@angular/forms';

@Component({  standalone:true,
  imports: [SHARE_IMPORTS],
  selector:'field-radio',
  templateUrl: './radio.html',
  styleUrl: './radio.scss'
})
export class RadioField  extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input({ required: true }) formControl: FormControl;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto=new ApplicantFormValueDto();
}
