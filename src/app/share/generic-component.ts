import { inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ToastService } from "@app/core/toast-service";
import { TokenService } from "@app/core/token-service";
import { NgxSpinnerService } from "ngx-spinner";

export class GenericComponent {
    protected spinnerService = inject(NgxSpinnerService);
    protected notify = inject(ToastService);
    protected tokenService = inject(TokenService);
    protected activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    route(address: string, queryParams?: Params) {
        this.router.navigate([`${address}`], { queryParams: queryParams })
    }
}