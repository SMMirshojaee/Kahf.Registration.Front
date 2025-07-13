export class RegDto {
    public constructor(raw: any) {
        this.id = raw['id'];
        this.title = raw['title'];
        this.imageAddress = raw['imageAddress'];
        this.description = raw['description'];
        this.startDate = raw['startDate'];
        this.endDate = raw['endDate'];
        this.isActive = raw['isActive'];
        this.regSteps = raw['regSteps'];
    }
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
    public memberLimit: number;
    public addMemberDescription: string;
    public regStepStatuses: RegStepStatusDto[];
}

export class RegStepStatusDto {
    public id: number;
    public regStepId: number;
    public title: string;
    public publicMessage: string;
    public isWaiting: boolean;
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