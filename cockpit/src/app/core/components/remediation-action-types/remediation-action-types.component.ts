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
  selector: "app-remediation-action-types",
  imports: [ToggleButtonModule, FormsModule, SharedModule],
  templateUrl: "./remediation-action-types.component.html",
  styleUrl: "./remediation-action-types.component.scss",
})
export class RemediationActionTypesComponent implements OnInit, OnDestroy {
  @Output() remediationActionTypesSet: EventEmitter<string[]> =
    new EventEmitter<string[]>();
  sidebarService = inject(RemediationSidebarService);

  selectedRemediationActionTypes: {
    [key: string]: boolean;
  } = {
    assisted: false,
    human: false,
    automated: false,
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
    const resetRemediationActionTypes = {
      assisted: false,
      human: false,
      automated: false,
    };

    this.selectedRemediationActionTypes = { ...resetRemediationActionTypes };
    this.remediationActionTypesSet.emit([]);
  }

  updateFilters() {
    const activeFilters = Object.keys(this.selectedRemediationActionTypes)
      .filter((key) => this.selectedRemediationActionTypes[key])
      .map((key) => key.toUpperCase());

    this.remediationActionTypesSet.emit(activeFilters);
  }
}
