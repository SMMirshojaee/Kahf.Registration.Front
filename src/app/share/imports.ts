import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { DividerModule } from "primeng/divider";
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgPersianDatepickerModule } from "ng-persian-datepicker";
import { AccordionModule } from 'primeng/accordion';

export const SHARE_IMPORTS = [
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule,
    InputTextModule,
    FloatLabelModule,
    ToastModule,
    MessageModule,
    NgxSpinnerModule,
    NgPersianDatepickerModule,
    CardModule,
    AccordionModule
]