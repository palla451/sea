import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ToggleButtonModule } from "primeng/togglebutton";
import { AssetSidebarService } from "../../../features/asset-management/services/asset-sidebar.service";
import { Subscription } from "rxjs";
import { CyberResilienceSidebarService } from "../../../features/dashboard/services/cyber-resilience-sidebar.service";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
  selector: "app-asset-status",
  imports: [ToggleButtonModule, FormsModule, TranslocoModule],
  templateUrl: "./asset-status.component.html",
  styleUrl: "./asset-status.component.scss",
})
export class AssetStatusComponent implements OnInit, OnDestroy {
  @Output() assetsStatusSet: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  sidebarService = inject(AssetSidebarService);
  cyberResilienceSidebarService = inject(CyberResilienceSidebarService);

  selectedLevels: {
    [key: string]: boolean;
  } = {
    operational: false,
    turnedOff: false,
    maintenance: false,
    compromised: false,
  };

  private resetSubscription!: Subscription;

  ngOnInit(): void {
    // Sottoscrizione al reset
    this.resetSubscription = this.sidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );

    this.resetSubscription =
      this.cyberResilienceSidebarService.resetTriggered.subscribe(() => {
        this.resetFilters();
      });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }

  private resetFilters(): void {
    const resetSelectedLevels = {
      critical: false,
      high: false,
      medium: false,
      low: false,
    };

    this.selectedLevels = { ...resetSelectedLevels };
    this.assetsStatusSet.emit([]);
  }

  updateFilters() {
    const activeFilters = Object.keys(this.selectedLevels)
      .filter((key) => this.selectedLevels[key])
      .map((key) => key.toUpperCase());

    this.assetsStatusSet.emit(activeFilters);
  }
}
