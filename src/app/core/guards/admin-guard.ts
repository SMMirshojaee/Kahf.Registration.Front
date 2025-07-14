import { CanActivateFn } from '@angular/router';
import { TokenService } from '../token-service';
import { inject } from '@angular/core';
import { ToastService } from '../toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  if (state.url.toLowerCase().startsWith('/admin/login'))
    return true;
  const tokenService = inject(TokenService);
  const notify = inject(ToastService);
  let isValid = tokenService.getActor()?.toLowerCase() == 'admin' || tokenService.getActor()?.toLowerCase() == 'superadmin';
  if (isValid)
    return true;
  notify.unauthorize();
  tokenService.logout();
  return false;
};
