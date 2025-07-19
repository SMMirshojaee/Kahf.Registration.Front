import { FieldDto, FieldOptionDto } from "./field.dto";
import { RegStepStatusDto } from "./reg.dto";

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
export class ApplicantWithFormValueDto {
    public id: number;
    public createdDate: Date;
    public regId: number;
    public statusId: number;
    public nationalNumber: string;
    public phoneNumber: string;
    public firstName: string;
    public lastName: string;
    public leaderId: number;
    public trackingCode: number;
    public description: string;
    public inverseLeader: ApplicantWithFormValueDto[];
    public applicantFormValues: ApplicantFormValueDto[];
    public status: RegStepStatusDto;
    //
    public notFilledMandoryFields: any[];
}