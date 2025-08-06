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
import { Subscription } from "rxjs";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
  selector: "app-alert-filters",
  imports: [ToggleButtonModule, FormsModule, TranslocoModule],
  templateUrl: "./alert-filters.component.html",
  styleUrl: "./alert-filters.component.scss",
})
export class AlertFiltersComponent implements OnInit, OnDestroy {
  @Output() alertsSet: EventEmitter<string[]> = new EventEmitter<string[]>();
  sidebarService = inject(SidebarService);

  selectedLevels: {
    [key: string]: boolean;
  } = {
    critical: false,
    high: false,
    medium: false,
    low: false,
  };

  private resetSubscription!: Subscription;

  ngOnInit(): void {
    // Sottoscrizione al reset
    this.resetSubscription = this.sidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );
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
    this.alertsSet.emit([]);
  }

  updateFilters() {
    const activeFilters = Object.keys(this.selectedLevels)
      .filter((key) => this.selectedLevels[key])
      .map((key) => key.toUpperCase());

    this.alertsSet.emit(activeFilters);
  }

  // getActiveFilters(): string[] {
  //   return Object.keys(this.selectedLevels)
  //     .filter(key => this.selectedLevels[key])
  //     .map(key => key.toUpperCase());
  // }
}
