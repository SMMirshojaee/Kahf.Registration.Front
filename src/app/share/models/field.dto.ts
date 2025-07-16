export class FieldDto {
    public id: number;
    public regStepId: number;
    public fieldTypeId: number;
    public order: number;
    public title: string;
    public description: string;
    public mandatory: boolean;
    public forLeader: boolean;
    public forMember: boolean;
    public hidden: boolean;
    public fieldOptions: FieldOptionDto[];
    //فیلدهای زیر فقط در هنگام نمایش فرم مورد استفاده قرار میگیرن و در کلاس اصلی حضور ندارن
    public optionsToShow: { value?: string, title: string, id: number }[];
    public minDate: number;
    public maxDate: number;
    public imageBase64: string;
    public maxSizeInMB: number;
    public imageFile: File;
    public fileName: string;
    public fileExtension: string;
    public imageSource: string;
}

export class FieldOptionDto {
    public id: number;
    public fieldId: number;
    public title: string;
    public type: string;
    public value?: string;
}

export class FieldTypeDto {
    public id: number;
    public title: string;
    public name: string;

}