export class PaymentDto {
    public regStepId: number;
    public perPersonAmount: number;
    public description?: number;
    public installmentsCount?: number;
}
export class OrderDto {
    public amount: number;
    public createdDate: Date;
    public applicantId: number;
    public regStepId: number;
    public requestStatus?: number;
    public requestDate?: Date;
    public authority?: string;
    public verifyStatus?: number;
    public verifyDate?: Date;
    public refId?: number;
}

export class ApplicantOrderDto {
    public id: number;
    public statusId: number;
    public statusTitle?: string;
    public stepTitle?: string;
    public firstName: string;
    public lastName: string;
    public nationalNumber: string;
    public phoneNumber: string;
    public membersCount: number;
    public trackingCode?: number;
    public orders: OrderDto[];
    public applicantExtraCosts: ApplicantExtraCostDto[];
    //
    public fullName: string;
    public totalExtraCosts: number;
    public totalCost: number;
    public totalCash: number;
    public totalLoan: number;
    public remained: number;
}
export class ApplicantExtraCostDto {
    public id: number;
    public title: string;
    public amount: number;
    public description?: string
}