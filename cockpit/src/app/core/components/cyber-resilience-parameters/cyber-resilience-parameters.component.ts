// import { Component, computed, inject } from "@angular/core";
// import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
// import { toSignal } from "@angular/core/rxjs-interop";
// import { CommonModule } from "@angular/common";
// import { ProgressBarModule } from "primeng/progressbar";
// import { ToastModule } from "primeng/toast";
// import { CardModule } from "primeng/card";

// @Component({
//   selector: "app-cyber-resilience-parameters",
//   imports: [CommonModule, ToastModule, ProgressBarModule, CardModule],
//   templateUrl: "./cyber-resilience-parameters.component.html",
//   styleUrl: "./cyber-resilience-parameters.component.scss",
// })
// export class CyberResilienceParametersComponent {
//   crOverviewManager = inject(CyberResilienceOVManagerService);
//   cyberResilienceFunctionality = toSignal(
//     this.crOverviewManager.selectedCyberResiliencePerformance$,
//     { initialValue: null }
//   );

//   cyberResilienceFunctionalityPercent = computed(() => {
//     return Number(this.cyberResilienceFunctionality()?.['operatingPercentage']
//  || 0);
//   });

//   calculateArrowPosition(): number {
//     return this.cyberResilienceFunctionalityPercent();
//   }

//   getProgressBarClass(): string {
//     if (
//       this.cyberResilienceFunctionalityPercent() >= 0 &&
//       this.cyberResilienceFunctionalityPercent() < 40
//     ) {
//       return "progress-red";
//     } else if (
//       this.cyberResilienceFunctionalityPercent() >= 40 &&
//       this.cyberResilienceFunctionalityPercent() < 75
//     ) {
//       return "progress-yellow";
//     } else {
//       return "progress-green";
//     }
//   }

//   getArrowClass(): string {
//     if (
//       this.cyberResilienceFunctionalityPercent() >= 0 &&
//       this.cyberResilienceFunctionalityPercent() < 40
//     ) {
//       return "arrow-red";
//     } else if (
//       this.cyberResilienceFunctionalityPercent() >= 40 &&
//       this.cyberResilienceFunctionalityPercent() < 75
//     ) {
//       return "arrow-yellow";
//     } else {
//       return "arrow-green";
//     }
//   }
// }





import { Component, computed, inject, Input } from "@angular/core";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { CardModule } from "primeng/card";
import { color } from "d3";

@Component({
  selector: "app-cyber-resilience-parameters",
  imports: [CommonModule, ToastModule, ProgressBarModule, CardModule],
  templateUrl: "./cyber-resilience-parameters.component.html",
  styleUrl: "./cyber-resilience-parameters.component.scss",
})
export class CyberResilienceParametersComponent {
  crOverviewManager = inject(CyberResilienceOVManagerService);
  
  @Input() remediationImpact: number | null = null;
  
  cyberResilienceFunctionality = toSignal(
    this.crOverviewManager.selectedCyberResiliencePerformance$,
    { initialValue: null }
  );

  cyberResilienceFunctionalityPercent = computed(() => {
    return Number(this.cyberResilienceFunctionality()?.['operatingPercentage'] || 0);
  });

  calculateArrowPosition(): number {
    return this.cyberResilienceFunctionalityPercent();
  }

  getProgressBarClass(): string {
    if (
      this.cyberResilienceFunctionalityPercent() >= 0 &&
      this.cyberResilienceFunctionalityPercent() < 40
    ) {
      return "progress-red";
    } else if (
      this.cyberResilienceFunctionalityPercent() >= 40 &&
      this.cyberResilienceFunctionalityPercent() < 75
    ) {
      return "progress-yellow";
    } else {
      return "progress-green";
    }
  }

  getArrowClass(): string {
    if (
      this.cyberResilienceFunctionalityPercent() >= 0 &&
      this.cyberResilienceFunctionalityPercent() < 40
    ) {
      return "arrow-red";
    } else if (
      this.cyberResilienceFunctionalityPercent() >= 40 &&
      this.cyberResilienceFunctionalityPercent() < 75
    ) {
      return "arrow-yellow";
    } else {
      return "arrow-green";
    }
  }

  getRemediationImpactStyle(): any {
    if (this.remediationImpact === null) return {};
    
    const basePosition = this.cyberResilienceFunctionalityPercent();
    const width = Math.abs(this.remediationImpact);
    const left = this.remediationImpact > 0 ? basePosition : basePosition - width;
    
    return {
      left: `${left}%`,
      width: `${width}%`,
      opacity: 0.5,
    };
  }
}