import { CommonModule } from "@angular/common";
import { Component, computed, Input, signal } from "@angular/core";
import { AssistedActionStatusComponent } from "../assisted-action-status/assisted-action-status.component";
import { Action } from "../../../features/incident-detail/models/incident-detail.models";
import { ActionTypes,ManageIncidentStatesEnum } from "../../enums/manage-incident-states.enum";

@Component({
  selector: "app-stepper-action-details",
  imports: [CommonModule, AssistedActionStatusComponent],
  templateUrl: "./stepper-action-details.component.html",
  styleUrl: "./stepper-action-details.component.scss",
})
export class StepperActionDetailsComponent {
  _currentAction = signal<Action | null>(null);
  @Input() set currentAction(currentAction: Action) {
    this._currentAction.set(currentAction);
  }

  get currAction() {
    return this._currentAction();
  }

  checkIfActionStatusIsVisible = computed(() => {
    return (
      !!this._currentAction() &&
      this._currentAction()?.actionType.toLowerCase() ===
        ActionTypes.ACTION_ASSISTED && (this._currentAction()?.status.toLowerCase() !==
        ManageIncidentStatesEnum.ACTION_NEW &&  this._currentAction()?.status.toLowerCase() !==
        ManageIncidentStatesEnum.ACTION_ROLLBACKED)
    );
  });
}
