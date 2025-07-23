import { Component, inject } from '@angular/core';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { RegTile } from '../components/reg-tile/reg-tile';
import { ActivatedRoute } from '@angular/router';
import { ApplicantService } from '@app/core/applicant-service';
import { RegStepService } from '@app/core/reg-step-service';
import { finalize, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/module.d';
import { ApplicantInfoDto } from '@app/share/models/applicant.dto';
import { RegStepDto } from '@app/share/models/reg.dto';
import { StepPipe } from '@app/share/step-pipe';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, RegTile, StepPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard extends GenericComponent {
  private activateRoute = inject(ActivatedRoute);
  private applicantService = inject(ApplicantService);
  private regStepService = inject(RegStepService);

  // protected menu: MenuItem[];
  protected applicants: ApplicantInfoDto[];
  protected regSteps: RegStepDto[];
  private regId: number;
  protected statistics = {};
  protected selectedRegStep: RegStepDto;

  ngOnInit() {
    this.regId = this.activateRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      applicants: this.getApplicants(),
      regSteps: this.getRegSteps(),

    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.applicants = data.applicants;
          this.regSteps = data.regSteps;
          this.prepareDataToShow();
        },
        error: (err: HttpErrorResponse) => {
          this.notify.defaultError();
        }
      })
  }
  prepareDataToShow() {
    this.statistics['totalCount'] = this.applicants.length;
    this.statistics['leadersCount'] = this.applicants.filter(e => !e.leaderId).length;
    this.statistics['membersCount'] = this.applicants.filter(e => e.leaderId).length;

    this.regSteps.forEach(step => {
      this.statistics[`step_${step.id}`] = this.applicants.filter(e => step.regStepStatuses.map(s => s.id).includes(e.statusId) || (step.order == 1 && e.statusId == null)).length;
      step.regStepStatuses.forEach(status => {
        this.statistics[`status_${status.id}`] = this.applicants.filter(e => e.statusId == status.id).length;
      });
    });

  }
  viewApplicants(regStep: RegStepDto) {
    this.route('admin/step/' + this.regId + '/' + regStep.id);
  }
  getApplicants() {
    return this.applicantService.getByRegId(this.regId)
  }
  getRegSteps() {
    return this.regStepService.getByRegId(this.regId)
  }

}
