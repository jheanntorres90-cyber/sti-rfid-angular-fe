import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary, detail, closable: false });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({ severity: 'error', summary, detail, closable: false });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({ severity: 'info', summary, detail, closable: false });
  }

  showWarn(summary: string, detail: string) {
    this.messageService.add({ severity: 'warn', summary, detail, closable: false });
  }
}

