import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { AssetManagementComponentsModule } from "../../../asset-management/modules/asset-management-components.module";
import { RemediationSidebarService } from "../../services/remediation-sidebar.service";

@Component({
  selector: "app-rollback-modal",
  standalone: true,
  imports: [AssetManagementComponentsModule],
  templateUrl: "./rollback-modal.component.html",
  styleUrl: "./rollback-modal.component.scss",
})
export class RollbackModalComponent {
  private remediationSidebarService = inject(RemediationSidebarService);
  private _visible = signal(false);
  private _rollbackedActionId = signal("");

  @Input() set visible(value: boolean) {
    this._visible.set(value);
  }
  @Input() set rollbackedActionId(value: string) {
    this._rollbackedActionId.set(value);
    if(value && value !== ''){
      this.remediationSidebarService.updateLastRollbackedActionId(Number(value));
    }
  }

  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @ViewChild("rollbackModalBody", { static: true })
  rollbackModalBody!: TemplateRef<any>;

  onConfirm() {
    this.save.emit();
    this._visible.set(false);
  }

  onBackClick() {
    this.back.emit();
    this._visible.set(false);
  }

  onClose() {
    this.close.emit();
    this._visible.set(false);
  }
  get isVisible() {
    return this._visible();
  }
}
