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
import { RemediationSidebarService } from "../../../features/remediation-management/services/remediation-sidebar.service";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-remediation-action-statuses",
  imports: [ToggleButtonModule, FormsModule, SharedModule],
  templateUrl: "./remediation-action-statuses.component.html",
  styleUrl: "./remediation-action-statuses.component.scss",
})
export class RemediationActionStatusesComponent implements OnInit, OnDestroy {
  @Output() remediationActionStatusesSet: EventEmitter<string[]> =
    new EventEmitter<string[]>();
  sidebarService = inject(RemediationSidebarService);
  actionCompletedLabel = "Completed";
  actionRollbackedLabel = "Rollbacked";

  selectedRemediationActionStatuses: {
    [key: string]: boolean;
  } = {
    completed: false,
    rollbacked: false,
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
    const resetRemediationActionStatuses = {
      completed: false,
      rollbacked: false,
    };

    this.selectedRemediationActionStatuses = {
      ...resetRemediationActionStatuses,
    };
    this.remediationActionStatusesSet.emit([]);
  }

  updateFilters() {
    const activeFilters = Object.keys(this.selectedRemediationActionStatuses)
      .filter((key) => this.selectedRemediationActionStatuses[key])
      .map((key) => key.toUpperCase());

    this.remediationActionStatusesSet.emit(activeFilters);
  }
}
