import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "@app/core/toast-service";
import { NgxSpinnerService } from "ngx-spinner";

export class GenericComponent {
    protected spinnerService = inject(NgxSpinnerService);
    protected notify = inject(ToastService);

    private router = inject(Router);
    route(address: string) {
        this.router.navigate([`${address}`])
    }
}