import { Component, Input } from '@angular/core';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldDto } from '@app/share/models/field.dto';
import { GenericField } from '../field-generic';
import { FormControl, Validators } from '@angular/forms';
import { MobileValidator } from '@app/share/validators/mobile.validator';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  selector: 'field-mobile',
  templateUrl: './mobile.html',
  styleUrl: './mobile.scss'
})
export class MobileField extends GenericField {
  @Input({ required: true }) field: FieldDto;
  @Input({ required: true }) formControl: FormControl;
  @Input() readonly: boolean;
  @Input() value: ApplicantFormValueDto = new ApplicantFormValueDto();
  mobileValue: FormControl;

  ngOnInit() {
    this.mobileValue = new FormControl('', [MobileValidator]);
    if (this.field.mandatory)
      this.mobileValue.addValidators(Validators.required)
  }

}
