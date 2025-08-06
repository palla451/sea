import { Component, Input, signal } from "@angular/core";
import { SharedModule } from "../../../../../shared/shared.module";

@Component({
  selector: "app-assets-statement",
  imports: [SharedModule],
  templateUrl: "./assets-statement.component.html",
  styleUrl: "./assets-statement.component.scss",
})
export class AssetsStatementComponent {
  operatingAssets = signal<number>(0);
  compromisedAssets = signal<number>(0);
  turnedOffAssets = signal<number>(0);
  maintenanceAssets = signal<number>(0);

  @Input() set operationalCount(operationalCount: number) {
    if (operationalCount) {
      this.operatingAssets.set(Number(operationalCount));
    }
  }

  @Input() set maintenanceCount(maintenanceCount: number) {
    if (maintenanceCount) {
      this.maintenanceAssets.set(Number(maintenanceCount));
    }
  }

  @Input() set turnedOffCount(turnedOffCount: number) {
    if (turnedOffCount) {
      this.turnedOffAssets.set(Number(turnedOffCount));
    }
  }

  @Input() set compromisedCount(compromisedCount: number) {
    if (compromisedCount) {
      this.compromisedAssets.set(Number(compromisedCount));
    }
  }
}
