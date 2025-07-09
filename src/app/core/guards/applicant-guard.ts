import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../token-service';
import { ToastService } from '../toast-service';

export const applicantGuard: CanActivateFn = (route, state) => {
  if (state.url.toLowerCase().startsWith('/applicant/signin') ||
    state.url.toLowerCase().startsWith('/applicant/signup'))
    return true;
  const tokenService = inject(TokenService);
  const notify = inject(ToastService);
  let isValid = tokenService.getActor()?.toLowerCase() == 'applicant';
  if (isValid)
    return true;
  notify.unauthorize();
  tokenService.logout();
  return false;
};
