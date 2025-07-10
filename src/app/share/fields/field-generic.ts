import { FormControl } from "@angular/forms";
import { ApplicantFormValueDto } from "../models/applicant-form-value.dto";
import { FieldDto } from "../models/field.dto";

export abstract class GenericField {
    abstract field: FieldDto;
    abstract readonly: boolean;
    abstract value: ApplicantFormValueDto;
    abstract formControl: FormControl;
}