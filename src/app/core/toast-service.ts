import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);
  constructor() { }

  success(message: string, detail?: string) {
    this.messageService.add({
      key: 'toast',
      severity: 'success',
      summary: message,
      detail: detail,
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
