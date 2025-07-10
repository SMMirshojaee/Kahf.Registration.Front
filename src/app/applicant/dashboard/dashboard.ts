import { Component, inject } from '@angular/core';
import { ApplicantService } from '@app/core/applicant-service';
import { RegStepService } from '@app/core/reg-step-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantDto } from '@app/share/models/applicant.dto';
import { RegStepDto } from '@app/share/models/reg.dto';
import { StepEnum } from '@app/share/models/step.enum';
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
  protected applicantStatus: ApplicantDto = { regStepId: 0 } as ApplicantDto;
  private currentRegStep: RegStepDto;
  protected currentRegStepOrder: number = 0;
  protected STEP_ENUM = StepEnum;

  ngOnInit() {
    this.spinnerService.show();
    forkJoin({
      regSteps: this.regStepService.getAll(),
      status: this.applicantService.getStatus(),
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.regSteps = data.regSteps;
          this.applicantStatus = data.status;
          this.currentRegStep = this.regSteps.find(e => e.id == this.applicantStatus.regStepId);
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
      if (this.applicantStatus.isNotChecked)
        klass = 'bg-blue-200';
      else if (this.applicantStatus.isRejected)
        klass = 'bg-red-500';
      else if (this.applicantStatus.isReserved)
        klass = 'bg-cyan-300'
      else if (this.applicantStatus.isAccepted)
        klass = 'bg-green-300'
      else klass = '';
    return klass;
  }
  fillForm(step: RegStepDto) {
    this.route(`/applicant/fill-form/${step.id}`);
  }

  payExpense(step: RegStepDto) {
    this.route(`/applicant/pay/${step.id}`);
  }
}
