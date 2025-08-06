import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { CardModule } from "primeng/card";
import { CustomScrollDirective } from "../../../../../core/directives/custom-scroll.directive";
import { NavigationService } from "../../../../../core/services/navigation.service";
import { CyberResilienceOVManagerService } from "../../../services/cyber-resilience-ovmanager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { selectAllVesselMacroFunctions } from "../../../state";
import { FunctionNode } from "../../../models/dashboard.models";

@Component({
  selector: "app-vessel-performance",
  imports: [
    CommonModule,
    ToastModule,
    ProgressBarModule,
    CardModule,
    CustomScrollDirective,
  ],
  templateUrl: "./vessel-performance.component.html",
  styleUrl: "./vessel-performance.component.scss",
})
export class VesselPerformanceComponent  {
  private readonly store = inject(Store);
  navigationManagerService = inject(NavigationService);
  cyberResilienceOVManager = inject(CyberResilienceOVManagerService);
  performances = toSignal(
    this.cyberResilienceOVManager.cyberPerformancesList$,
    { initialValue: null }
  );

  shipMacroFunctions = toSignal(
        this.store.select(selectAllVesselMacroFunctions),
        {
          initialValue: [],
        }
  );

  constructor(){
     effect(() => {
      if(this.shipMacroFunctions()){
        this.cyberResilienceOVManager.updateCyberPerformancesList(this.shipMacroFunctions());
      }
    });
  }

  calculateArrowPosition(value: string): number {
    return Number(value);
  }

  getProgressBarClass(value: string): string {
    const numberValue = Number(value);

    if (numberValue >= 0 && numberValue < 40) {
      return "progress-red";
    } else if (numberValue >= 40 && numberValue < 75) {
      return "progress-yellow";
    } else {
      return "progress-green";
    }
  }

  getArrowClass(value: string): string {
    const numberValue = Number(value);

    if (numberValue >= 0 && numberValue < 40) {
      return "arrow-red";
    } else if (numberValue >= 40 && numberValue < 75) {
      return "arrow-yellow";
    } else {
      return "arrow-green";
    }
  }

  goToCyberResilienceOV(selectedShipMacrofunction: FunctionNode): void {
    this.navigationManagerService.openCyberResilienceOVPage();
    this.cyberResilienceOVManager.updateSelectedCRPerformance(
      selectedShipMacrofunction
    );
  }
}
