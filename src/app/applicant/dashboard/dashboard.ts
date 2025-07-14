import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '@app/core/applicant-service';
import { RegStepService } from '@app/core/reg-step-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantDto, MemberInfoDto, SignupDto } from '@app/share/models/applicant.dto';
import { RegStepDto, RegStepStatusDto } from '@app/share/models/reg.dto';
import { StepEnum } from '@app/share/models/step.enum';
import { MobileValidator } from '@app/share/validators/mobile.validator';
import { NationalCodeValidator } from '@app/share/validators/national-code.validator';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard extends GenericComponent {
  private applicantService = inject(ApplicantService);
  private regStepService = inject(RegStepService);
  protected regSteps: RegStepDto[];
  protected applicantInfo: ApplicantDto = { regStepId: 0 } as ApplicantDto;
  protected currentRegStep: RegStepDto;
  protected applicantStatus: RegStepStatusDto;
  protected currentRegStepOrder: number = 0;
  protected STEP_ENUM = StepEnum;
  protected members: MemberInfoDto[];
  protected showAddMemberDialog: boolean;
  protected addMemberFormGroup: FormGroup;
  protected selectedMemberToRemove: MemberInfoDto;
  private selectedMemberIndexToRemove: number;
  protected showRemoveDialog: boolean;
  protected showFinishDialog: boolean;
  protected baseData: { firstName: string, lastName: string, nationalCode: string }
  ngOnInit() {
    const applicantInfo = this.tokenService.getApplicantInfo();
    this.baseData = {
      firstName: applicantInfo.firstName,
      lastName: applicantInfo.lastName,
      nationalCode: applicantInfo.nationalcode
    };
    this.addMemberFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      nationalCode: new FormControl('', [Validators.required, NationalCodeValidator]),
      mobile: new FormControl('', [Validators.required, MobileValidator])
    })
    this.spinnerService.show();
    forkJoin({
      regSteps: this.regStepService.getAll(),
      status: this.applicantService.getStatus(),
      members: this.applicantService.getMembers(),
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.regSteps = data.regSteps;
          this.applicantInfo = data.status;
          this.members = data.members;
          if (!this.applicantInfo.statusId) {
            this.applicantInfo.regStepId = this.regSteps[0].id;
            this.applicantInfo.statusId = this.regSteps[0].regStepStatuses.find(e => e.isWaiting).id;
            this.applicantInfo.isWaiting = true;
          }
          this.applicantInfo.statusTitle = this.regSteps.find(e => e.id == this.applicantInfo.regStepId).regStepStatuses.find(e => e.id == this.applicantInfo.statusId).title;
          this.currentRegStep = this.regSteps.find(e => e.id == this.applicantInfo.regStepId);
          this.applicantStatus = this.currentRegStep.regStepStatuses.find(e => e.id == this.applicantInfo.statusId);
          if (this.currentRegStep)
            this.currentRegStepOrder = this.currentRegStep.order;
        }, error: () => {
          this.notify.defaultError();
        }
      });
  }

  getClass(step: RegStepDto): string {
    if (!this.currentRegStep)
      return '';
    let klass = '';
    if (this.currentRegStepOrder > step.order)
      klass = 'bg-primary ';
    else if (this.currentRegStepOrder < step.order)
      klass = ' ';
    else
      if (this.applicantInfo.isWaiting)
        klass = 'bg-blue-200';
      else if (this.applicantInfo.isNotChecked)
        klass = 'bg-blue-200';
      else if (this.applicantInfo.isRejected)
        klass = 'bg-red-500';
      else if (this.applicantInfo.isReserved)
        klass = 'bg-cyan-300'
      else if (this.applicantInfo.isAccepted)
        klass = 'bg-green-300'
      else klass = '';
    return klass;
  }

  addMember() {
    if (this.currentRegStep.memberLimit > this.members.length) {
      this.openModel();

    } else {
      this.notify.warn('شما به سقف تعداد همراهان رسیده اید')
    }
  }
  removeMember(member: MemberInfoDto, index: number) {
    this.showRemoveDialog = true;
    this.selectedMemberToRemove = member;
    this.selectedMemberIndexToRemove = index;
  }
  confirmRemoveMember() {
    this.spinnerService.show();
    this.applicantService.removeMember(this.selectedMemberToRemove.id)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: () => {
          this.members.splice(this.selectedMemberIndexToRemove, 1);
          this.notify.defaultSuccess();
          this.closeRemoveModal();
        },
        error: (err: HttpErrorResponse) => this.notify.defaultError()
      })
  }
  closeRemoveModal() {
    this.showRemoveDialog = false;
  }
  submitMember() {
    if (this.addMemberFormGroup.invalid) {
      this.addMemberFormGroup.markAllAsDirty();
      this.notify.warn('موارد مشخص شده را رفع نمایید')
      return;
    }

    this.spinnerService.show();

    const firstName = this.addMemberFormGroup.get('firstName')?.value;
    const lastName = this.addMemberFormGroup.get('lastName')?.value;
    const mobile = this.addMemberFormGroup.get('mobile')?.value;
    const nationalCode = this.addMemberFormGroup.get('nationalCode')?.value;

    this.applicantService.addMember(this.currentRegStep.id, { firstName: firstName, lastName: lastName, nationalCode: nationalCode, mobile: mobile } as SignupDto)
      .pipe(finalize(() => {
        this.spinnerService.hide();
        this.addMemberFormGroup.reset();
      }
      ))
      .subscribe({
        next: data => {
          this.members.unshift(data);
          this.fillForm(this.currentRegStep.id, false, data);
          this.closeModal();
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 403)
            this.notify.error('امکان ثبت همراه در این مرحله وجود ندارد');
          else if (err.status == 409)
            this.notify.error('این کد ملی قبلا در سامانه ثبت شده است');
          else if (err.status == 507)
            this.notify.error('تعداد همراهان شما به سقف مجاز رسیده است');
          else
            this.notify.defaultError();
        }
      })

  }
  openModel() {
    this.showAddMemberDialog = true;
    this.addMemberFormGroup.reset();
  }
  closeModal() {
    this.showAddMemberDialog = false;
    this.addMemberFormGroup.reset();
  }

  fillForm(stepId: number, formIsDisable: boolean, member?: MemberInfoDto) {
    if (member) {
      localStorage.setItem('baseData', JSON.stringify(member));
      this.route(`/applicant/fill-form/${stepId}/${formIsDisable}/${member.id}`);
    }
    else
      this.route(`/applicant/fill-form/${stepId}/${formIsDisable}`);
  }

  payExpense(step: RegStepDto) {
    this.route(`/applicant/pay/${step.id}`);
  }

  openFinishModal() {
    this.showFinishDialog = true;
  }
  closeFinishModal() {
    this.showFinishDialog = false;
  }
  confirmFinish() {
    this.spinnerService.show();
    this.applicantService.finishFormStep(this.currentRegStep.id)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: () => {
          this.notify.defaultSuccess();
          this.closeFinishModal();
          this.ngOnInit();
        }, error: (err: HttpErrorResponse) => {
          if (err.status == 403)
            this.notify.error('شما هنوز اطلاعات مربوط به خود را وارد نکرده اید.')
          else
            this.notify.defaultError();
        }
      });
  }
}
