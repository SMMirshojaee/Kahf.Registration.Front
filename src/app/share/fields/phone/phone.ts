import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';

@Component({  standalone:true,
  imports: [SHARE_IMPORTS],
  selector:'field-phone',
  templateUrl: './phone.html',
  styleUrl: './phone.scss'
})
export class PhoneField  extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto=new ApplicantFormValueDto();
}
