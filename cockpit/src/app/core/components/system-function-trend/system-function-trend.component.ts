import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-system-function-trend",
  imports: [CommonModule],
  templateUrl: "./system-function-trend.component.html",
  styleUrl: "./system-function-trend.component.scss",
})
export class SystemFunctionTrendComponent {
  @Input() color: string = "#F64D4D"; // default rosso
  @Input() direction: "up" | "down" = "up";
  @Input() percentage: string = "35%";
}
