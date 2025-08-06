import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { HistorySidebarService } from "../../../features/history/services/history-sidebar.service";
import { Subscription } from "rxjs";
import { ToggleButtonModule } from "primeng/togglebutton";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-incident-statuses",
  imports: [ToggleButtonModule, FormsModule, SharedModule],
  templateUrl: "./incident-statuses.component.html",
  styleUrl: "./incident-statuses.component.scss",
})
export class IncidentStatusesComponent implements OnInit, OnDestroy {
  @Output() incidentStatusesSet: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  sidebarService = inject(HistorySidebarService);

  selectedStatuses: {
    [key: string]: boolean;
  } = {
    solved: false,
    falsePositive: false,
  };

  private resetSubscription!: Subscription;

  ngOnInit(): void {
    /**
     * Sottoscrizione al reset
     */
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
      solved: false,
      falsePositive: false,
    };

    this.selectedStatuses = { ...resetSelectedLevels };
    this.incidentStatusesSet.emit([]);
  }

  updateFilters() {
    const activeFilters = Object.keys(this.selectedStatuses)
      .filter((key) => this.selectedStatuses[key])
      .map((key) => key.toUpperCase());

    this.incidentStatusesSet.emit(activeFilters);
  }
}
