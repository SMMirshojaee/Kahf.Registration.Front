
export class SignupDto {
    public firstName: string;
    public lastName: string;
    public nationalCode: string;
    public mobile: string;
}
export class SigninDto {
    public nationalCode: string;
    public mobile: string;
    public trackingCode: string;
}
export class ApplicantInfoDto {
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
    public inverseLeader: ApplicantInfoDto[];
}
export class ApplicantDto {
    public createdDate: Date;
    public statusId: number;
    public regStepId: number;
    public title: string;
    public isWaiting: boolean;
    public isNotChecked: boolean;
    public isAccepted: boolean;
    public isReserved: boolean;
    public isRejected: boolean;
    //
    public statusTitle?: string;
}
export class MemberInfoDto {
    public id: number;
    public statusId: number;
    public firstName: string;
    public lastName: string;
    public nationalNumber: string;
    public phoneNumber: string;
    //
    public formIsDisable: boolean;
}
