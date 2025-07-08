import { inject } from "@angular/core";
import { ToastService } from "@app/core/toast-service";
import { NgxSpinnerService } from "ngx-spinner";

export class GenericComponent {
    protected spinnerService = inject(NgxSpinnerService);
    protected notify = inject(ToastService);
}