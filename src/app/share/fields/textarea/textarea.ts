import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  selector: 'field-textarea',
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss'
})
export class TextareaField  extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto=new ApplicantFormValueDto();
}
