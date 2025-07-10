import { HttpErrorResponse } from '@angular/common/module.d';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicantFormValueService } from '@app/core/applicant-form-value-service';
import { FieldService } from '@app/core/field-service';
import { FIELD_IMPORTS } from '@app/share/fields/fields-import';
import { GenericComponent } from '@app/share/generic-component';
import { SHARE_IMPORTS } from '@app/share/imports';
import { ApplicantFormValueDto } from '@app/share/models/applicant-form-value.dto';
import { FieldTypeEnum } from '@app/share/models/field-type.enum';
import { FieldDto } from '@app/share/models/field.dto';
import { finalize, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  imports: [SHARE_IMPORTS, FIELD_IMPORTS],
  templateUrl: './fill-form.html',
  styleUrl: './fill-form.scss'
})
export class FillForm extends GenericComponent {
  private fieldService = inject(FieldService);
  private applicantFormValueService = inject(ApplicantFormValueService);
  private activatedRoute = inject(ActivatedRoute);
  private regStepId: number;
  protected fields: FieldDto[];
  protected values: ApplicantFormValueDto[];
  protected FIELD_TYPE_ENUM = FieldTypeEnum;
  ngOnInit() {
    this.regStepId = this.activatedRoute.snapshot.params['id'];
    this.spinnerService.show();
    forkJoin({
      fields: this.fieldService.getByRegStepId(this.regStepId),
      values: this.applicantFormValueService.GetByRegStepId(this.regStepId)
    })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: data => {
          this.fields = data.fields;
          this.values = data.values;
        }, error: (err: HttpErrorResponse) => {

        }
      })
  }
}
