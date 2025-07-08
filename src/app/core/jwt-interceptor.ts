import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.toLowerCase().includes('api/applicant/signup') || req.url.toLowerCase().includes('api/reg/getdefault'))
    return next(req);
  const token = localStorage.getItem('jwtToken');
  if (token) {
    let newReq = req.clone({
      setHeaders: {
        'Authorization': `bearer ${token}`
      }
    });
    return next(newReq);
  }
  return next(req);
};
