import { Component, inject, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ToastCloseEvent, ToastModule } from 'primeng/toast';
import { ToastMessage } from '../../models/toastMessage.model';
import { messageActions } from '../../state/actions';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent implements OnChanges {
  private readonly store = inject(Store);
  messageService = inject(MessageService);
  @Input() inputMessages!: ToastMessage[];

  ngOnChanges(): void {
    this.showStoredToasts();
    this.closeSuccessAlertsInATime();
  }

  private showStoredToasts(): void {
    this.inputMessages?.forEach((msg) => {
      this.showToast(msg);
    });
  }

  showToast(msg: ToastMessage) {
    this.messageService.add({
      id: msg.id,
      severity: msg.severity,
      summary: msg.summary,
      detail: msg.detail,
      life: msg.life ?? undefined,
    });
  }

  private closeSuccessAlertsInATime(): void {
    setTimeout(() => {
      this.inputMessages?.forEach((msg) => {
        if ((msg.severity as string) === 'success') {
          this.closeMsgBox(msg);
        }
      });
    }, 9000);
  }

  private closeMsgBox(msgToClose: ToastMessage): void {
    this.store.dispatch(messageActions.removeMessage({ id: msgToClose.id }));
  }

  onMessageClose(msg: ToastCloseEvent) {
    this.store.dispatch(messageActions.removeMessage({ id: msg.message.id }));
  }
}
