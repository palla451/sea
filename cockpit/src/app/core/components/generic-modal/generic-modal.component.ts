import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  TemplateRef,
} from "@angular/core";
import { GenericModal } from "../../models/genericModal.model";
import { SharedModule } from "../../../shared/shared.module";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-generic-modal",
  imports: [SharedModule, DialogModule],
  templateUrl: "./generic-modal.component.html",
  styleUrl: "./generic-modal.component.scss",
})
export class GenericModalComponent {
  @Input() title = "";
  @Input() bodyTemplate!: TemplateRef<unknown>;
  @Input() isSaveEnabled: boolean = false;
  @Input() visible: boolean = false;
  @Input() confirmLabel = "common.button.save";
  @Input() dialogWidth: string = "726px";
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  onSaveClick() {
    this.save.emit();
  }

  onBackClick() {
    this.back.emit();
  }

  onHide() {
    this.visibleChange.emit(false);
    this.close.emit();
  }
}
