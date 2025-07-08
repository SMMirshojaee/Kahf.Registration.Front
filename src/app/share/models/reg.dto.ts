export class RegDto {
    public id: number;
    public title: string;
    public imageAddress?: string;
    public description?: string;
    public startDate: Date;
    public endDate?: Date;
    public isActive: boolean;
    public regSteps: RegStepDto[];
}

export class RegStepDto {
    public id: number;
    public regId: number;
    public stepId: number;
    public title: string;
    public description?: string;
    public order: number;
    public regStepStatuses: RegStepStatusDto;
}

export class RegStepStatusDto {
    public id: number;
    public regStepId: number;
    public title: string;
    public isNotChecked: boolean;
    public isAccepted: boolean;
    public isReserved: boolean;
    public isRejected: boolean;

}

export class StepDto {
    public id: number;
    public title: string;
    public description: string;
    public regSteps: RegStepDto;
}