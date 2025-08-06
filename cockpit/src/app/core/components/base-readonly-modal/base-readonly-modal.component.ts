import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-base-readonly-modal",
  imports: [CommonModule, DialogModule, ButtonModule, SharedModule],
  templateUrl: "./base-readonly-modal.component.html",
  styleUrl: "./base-readonly-modal.component.scss",
})
export class BaseReadonlyModalComponent {
  @Input() heightPx?: number;

  incidentManagementManagerService = inject(IncidentManagementManagerService);
  remediationImpactModalOpened = toSignal(
    this.incidentManagementManagerService.isRemediationImpactModalOpen,
    {
      initialValue: false,
    }
  );

  currentStepperEventSelected = toSignal(
    this.incidentManagementManagerService.currentStepperEventSelected,
    {
      initialValue: "",
    }
  );

  private _isModalVisible = signal<boolean>(false);
  private _modalTitle = signal<string>("");

  @Input() modalWidth: string = "62rem";
  @Input() set isModalVisible(isModalVisible: boolean) {
    this._isModalVisible.set(isModalVisible || false);
  }

  @Input() set modalTitle(modalTitle: string) {
    this._modalTitle.set(modalTitle || "");
  }

  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();

  get isModalVisible() {
    return this._isModalVisible();
  }

  get modalTitle() {
    return this._modalTitle();
  }

  get currentStepperEventSel() {
    return this.currentStepperEventSelected();
  }

  closeModal(): void {
    this._isModalVisible.update(() => false);
    this.incidentManagementManagerService.updateIsBaseReadOnlyModalOpen(false);
    this.modalClosed.emit();
  }

  openModal(): void {
    this._isModalVisible.update(() => true);
  }

  goBack() {
    this.incidentManagementManagerService.updateIsRemediationImpactModalOpen(
      false
    );
  }

  get setCustomHeight(): { [key: string]: string } {
    const heightValue = `${this.heightPx}px`;
    return {
      height: this.heightPx ? heightValue : "738px",
      minHeight: this.heightPx ? heightValue : "738px",
    };
  }
}
