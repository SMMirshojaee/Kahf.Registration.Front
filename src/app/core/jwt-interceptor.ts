import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';
import { TokenService } from './token-service';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(ToastService);
  const tokenService = inject(TokenService);
  if (req.url.toLowerCase().includes('api/applicant/signup') || req.url.toLowerCase().includes('api/reg/getdefault'))
    return next(req);
  const token = tokenService.getTokenString();
  if (token) {
    let newReq = req.clone({
      setHeaders: {
        'Authorization': `bearer ${token}`
      }
    });
    return next(newReq)
      .pipe(catchError((error: HttpErrorResponse) => unauthorize(error)))
  }
  return next(req)
    .pipe(catchError((error: HttpErrorResponse) => unauthorize(error)));

  function unauthorize(error: HttpErrorResponse) {
    if (error.status == 401) {
      notify.warn('لطفا مجددا وارد سامانه شوید');
      tokenService.logout();
    }
    return throwError(() => error)
  }
};
