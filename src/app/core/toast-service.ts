import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);


  disconnect() {
    this.messageService.add({
      key: 'toast',
      severity: 'error',
      summary: 'عدم اتصال به اینترنت',
      detail: 'اتصال خود به اینترنت را بررسی کنید. چنانچه از اتصال خود به اینترنت مطمئن هستید، لطفا با راهبر سامانه تماس حاصل فرمایید',
    });
  }
  defaultError() {
    this.messageService.add({
      key: 'toast',
      severity: 'error',
      summary: 'خطا',
      detail: 'خطا در دریافت اطلاعات از سرور '
    });
  }
  unauthorize() {
    this.messageService.add({
      key: 'toast',
      severity: 'warn',
      summary: 'دسترسی غیرمجاز',
      detail: 'دسترسی شما به صفحه مورد نظر مسدود می باشد'
    });
  }
  success(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'success',
      summary: message,
      detail: detail
    });
  }
  defaultSuccess() {
    this.messageService.add({
      key: 'toast',
      severity: 'success',
      summary: "عملیات با موفقیت انجام شد",
    });
  }
  error(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'error',
      summary: message,
      detail: detail,
    });
  }
  warn(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'warn',
      summary: message,
      detail: detail,
    });
  }
  info(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'info',
      summary: message,
      detail: detail,
    });
  }
}
