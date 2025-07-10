import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { FieldDto, FieldOptionDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  selector: 'field-checkbox',
  templateUrl: './check-box.html',
  styleUrl: './check-box.scss'
})
export class CheckBoxField extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto = new ApplicantFormValueDto();
  protected optionsToShow: FieldOptionDto[];
  ngOnInit() {
    this.optionsToShow = this.field?.fieldOptions.filter(e => e.type === 'Option');
  }
}
