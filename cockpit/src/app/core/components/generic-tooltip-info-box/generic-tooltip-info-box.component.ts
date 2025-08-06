import { CommonModule } from "@angular/common";
import { Component, Input, signal } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-generic-tooltip-info-box",
  imports: [CommonModule, SharedModule],
  templateUrl: "./generic-tooltip-info-box.component.html",
  styleUrl: "./generic-tooltip-info-box.component.scss",
})
export class GenericTooltipInfoBoxComponent {
  private _isTooltipVisible = signal<boolean>(false);

  @Input() set isTooltipVisible(isTooltipVisible: boolean) {
    this._isTooltipVisible.set(isTooltipVisible);
  }
  get isTooltipVisible() {
    return this._isTooltipVisible();
  }

  private _text = signal<string>("");

  @Input() set text(tooltipContent: string) {
    this._text.set(tooltipContent);
  }
  get text() {
    return this._text();
  }

  @Input() leftPos?: string;
  @Input() rightPos?: string;

  get positionStyles(): { [key: string]: string } {
    const base = {
      position: "absolute",
    };

    if (this.leftPos !== undefined) {
      return { ...base, left: this.leftPos };
    } else if (this.rightPos !== undefined) {
      return { ...base, right: this.rightPos };
    }

    return base;
  }
}
