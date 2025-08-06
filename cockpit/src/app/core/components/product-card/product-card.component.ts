import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-product-card",
  imports: [DialogModule, SharedModule],
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.scss",
})
export class ProductCardComponent {
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

  closeModal(): void {
    this._isModalVisible.update(() => false);
    this.modalClosed.emit();
  }

  openModal(): void {
    this._isModalVisible.update(() => true);
  }
}
