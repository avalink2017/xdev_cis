import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'center';

const TOAST_KEYS: Record<ToastPosition, string> = {
  'top-right': 'global-toast',
  'top-left': 'global-toast-tl',
  'top-center': 'global-toast-tc',
  'bottom-right': 'global-toast-br',
  'bottom-left': 'global-toast-bl',
  'bottom-center': 'global-toast-bc',
  center: 'global-toast-c',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private life = 3000;

  messageService = inject(MessageService);

  test(msg: ToastMessageOptions) {
    this.messageService.add(msg);
  }

  showSuccess(summary: string, message: string, position: ToastPosition = 'top-right') {
    this.messageService.add({
      key: TOAST_KEYS[position],
      severity: 'success',
      summary,
      detail: message,
      life: this.life,
    });
  }

  showError(summary: string, message: string, position: ToastPosition = 'top-right') {
    this.messageService.add({
      key: TOAST_KEYS[position],
      severity: 'error',
      summary,
      detail: message,
      life: this.life,
    });
  }

  showInfo(summary: string, message: string, position: ToastPosition = 'top-right') {
    this.messageService.add({
      key: TOAST_KEYS[position],
      severity: 'info',
      summary,
      detail: message,
      life: this.life,
    });
  }

  showWarn(summary: string, message: string, position: ToastPosition = 'top-right') {
    this.messageService.add({
      key: TOAST_KEYS[position],
      severity: 'warn',
      summary,
      detail: message,
      life: this.life,
    });
  }
}
