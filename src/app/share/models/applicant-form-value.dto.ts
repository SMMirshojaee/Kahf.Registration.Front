import { FieldDto, FieldOptionDto } from "./field.dto";

export class ApplicantFormValueDto {
    public id: number;
    public applicantId: number;
    public fieldId: number;
    public regStepId: number;
    public value: string;
    public fieldOptionId: number;
    public deleted: boolean;
    public field: FieldDto;
    public fieldOption: FieldOptionDto;
}