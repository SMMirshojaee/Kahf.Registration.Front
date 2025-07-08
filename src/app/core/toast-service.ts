import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);

  success(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'success',
      summary: message,
      detail: detail
    });
  }
  disconnect() {
    this.messageService.add({
      key: 'toast',
      severity: 'error',
      summary: 'عدم اتصال به اینترنت',
      detail: 'اتصال خود به اینترنت را بررسی کنید. چنانچه از اتصال خود به اینترنت مطمئن هستید، لطفا با راهبر سامانه تماس حاصل فرمایید',
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
