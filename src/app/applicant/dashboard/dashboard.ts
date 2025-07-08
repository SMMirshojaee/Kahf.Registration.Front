import { Component, inject } from '@angular/core';
import { ApplicantService } from '@app/core/applicant-service';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard extends GenericComponent {
  private applicantService = inject(ApplicantService);

  ngOnInit() {
    this.applicantService
  }
}
