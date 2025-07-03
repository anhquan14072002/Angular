import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) { }

  showError(message: string, summary: string = 'Lỗi', life: number = 3000) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: message,
      life: life
    });
  }

  showSuccess(message: string, summary: string = 'Thành công', life: number = 3000) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
      life: life
    });
  }
}