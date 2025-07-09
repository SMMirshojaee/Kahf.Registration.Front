export class SignupDto {
    public nationalCode: string;
    public mobile: string;
}
export class SigninDto {
    public nationalCode: string;
    public mobile: string;
    public trackingCode: string;
}
export class ApplicantDto {
    public createdDate: Date;
    public statusId: number;
    public regStepId: number;
    public title: string;
    public isNotChecked: boolean;
    public isAccepted: boolean;
    public isReserved: boolean;
    public isRejected: boolean;
}