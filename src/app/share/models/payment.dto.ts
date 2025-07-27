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