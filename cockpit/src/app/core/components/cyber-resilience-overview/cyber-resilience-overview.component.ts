import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TreeViewIntegrityComponent } from "../tree-view-integrity/tree-view-integrity.component";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { ToastModule } from "primeng/toast";
import { NavigationService } from "../../services/navigation.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { FunctionNode } from "../../../features/dashboard/models/dashboard.models";
import { SharedModule } from "../../../shared/shared.module";
import { NavigationManagerService } from "../../services/navigation-manager.service";
import { NavigationTargetEnum } from "../../enums/navigation-targets.enum";

export interface MenuItem {
  id: string;
  title: string;
  percent: string;
  operatingAssets?: string;
  compromisedAssets?: string;
}

@Component({
  selector: "app-cyber-resilience-overview",
  imports: [
    CommonModule,
    TreeViewIntegrityComponent,
    ToastModule,
    SharedModule,
  ],
  templateUrl: "./cyber-resilience-overview.component.html",
  styleUrl: "./cyber-resilience-overview.component.scss",
})
export class CyberResilienceOverviewComponent {
  crOverviewManager = inject(CyberResilienceOVManagerService);
  navigationManagerService = inject(NavigationManagerService);
  navigationService = inject(NavigationService);
  menuItems = toSignal(this.crOverviewManager.cyberPerformancesList$, {
    initialValue: null,
  });
  currentActivePerformance = toSignal(
    this.crOverviewManager.selectedCyberResiliencePerformance$,
    { initialValue: null }
  );

  get activeItemData(): FunctionNode | undefined {
    return this.currentActivePerformance()
      ? this.menuItems()?.find(
          (item) => item.id === this.currentActivePerformance()?.id
        )
      : undefined;
  }

  selectItem(selectedItem: FunctionNode): void {
    this.crOverviewManager.updateSelectedCRPerformance(selectedItem);
  }

  navigateToDashboard(): void {
    this.navigationService.closeCyberResilienceOVPage();
    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.dashboard_page
    );
  }
}
