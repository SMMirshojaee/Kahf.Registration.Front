import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';

@Component({  standalone:true,
  imports: [SHARE_IMPORTS],
  selector:'field-image',
  templateUrl: './image.html',
  styleUrl: './image.scss'
})
export class ImageField  extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto=new ApplicantFormValueDto();
}
