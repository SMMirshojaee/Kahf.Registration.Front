export class FieldDto {
    public id: number;
    public regStepId: number;
    public fieldTypeId: number;
    public order: number;
    public title: string;
    public description: string;
    public mandatory: boolean;
    public hidden: boolean;
    public fieldOptions: FieldOptionDto[];
}

export class FieldOptionDto {
    public id: number;
    public fieldId: number;
    public title: string;
    public type: string;
    public value: string;
}

export class FieldTypeDto {
    public id: number;
    public title: string;
    public name: string;

}