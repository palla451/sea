import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { fromIncidentDetail } from "../../state";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-generic-hint",
  imports: [CommonModule, SharedModule],
  templateUrl: "./generic-hint.component.html",
  styleUrl: "./generic-hint.component.scss",
})
export class GenericHintComponent {
  private store = inject(Store);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  isMarkAsFalsePositiveRequiredSignal = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveRequired,
    {
      initialValue: false,
    }
  );

  isMarkAsFalsePositiveAcceptedSignal = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveAccepted,
    {
      initialValue: false,
    }
  );

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  get currentlySelectedIncident() {
    return this.allIncidents()[0];
  }

  checkIfCurrentEventIsMarkedAsFalsePositive(): boolean {
    return this.incidentManagementManagerService.checkIfCurrentEventIsFalsePositive(
      this.currentlySelectedIncident
    );
  }
}
