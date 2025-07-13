export class TokenDto {
    public tokenString: string;
    public RefreshToken: string;
}
export class ApplicantInfo {
    constructor(raw: any) {
        this.actor = raw["http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor"];
        this.applicantid = raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber"];
        this.regid = raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"];
        this.nationalcode = raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        this.mobile = raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"];
        this.firstName = raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        this.lastName = raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    }
    public actor: string;
    public applicantid: number;
    public regid: number;
    public nationalcode: string;
    public mobile: string;
    public firstName: string;
    public lastName: string;
}