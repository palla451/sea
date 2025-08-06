import { CommonModule } from "@angular/common";
import { Component, Input, signal } from "@angular/core";
import { Action } from "../../../features/incident-detail/models/incident-detail.models";
import { ManageIncidentStatesEnum } from "../../enums/manage-incident-states.enum";
import { GenericTooltipInfoBoxComponent } from "../generic-tooltip-info-box/generic-tooltip-info-box.component";

@Component({
  selector: "app-assisted-action-status",
  imports: [CommonModule, GenericTooltipInfoBoxComponent],
  templateUrl: "./assisted-action-status.component.html",
  styleUrl: "./assisted-action-status.component.scss",
})
export class AssistedActionStatusComponent {
  isShowNoteInfoBox = signal<boolean>(false);

  _currentAction = signal<Action | null>(null);
  @Input() set currentAction(currentAction: Action) {
    this._currentAction.set(currentAction);
  }

  get currAction() {
    return this._currentAction();
  }

  getAssistedActionStatusColor(actionStatus: string): string {
    let returningLevel = "";

    switch (actionStatus.toLowerCase()) {
      case ManageIncidentStatesEnum.ACTION_WRONG:
        returningLevel = "#F64D4D";
        break;
      case ManageIncidentStatesEnum.ACTION_PENDING:
        returningLevel = "#FFCF26";
        break;
      case ManageIncidentStatesEnum.ACTION_COMPLETED:
        returningLevel = "#67CA00";
    }

    return returningLevel;
  }

  getAssistedActionStatusShadow(actionStatus: string): string {
    let returningShadow = "";

    switch (actionStatus.toLowerCase()) {
      case ManageIncidentStatesEnum.ACTION_WRONG:
        returningShadow = "0 0 0 2px rgba(246, 77, 77, 0.2)";
        break;
      case ManageIncidentStatesEnum.ACTION_PENDING:
        returningShadow = "0 0 0 2px rgba(255, 207, 38, 0.2)";
        break;
      case ManageIncidentStatesEnum.ACTION_COMPLETED:
        returningShadow = "0 0 0 2px rgba(103, 202, 0, 0.2)";
    }

    return returningShadow;
  }

  mapLabelForActionStatus(actionStatus: string): string {
    let returningLabel = "";

    switch (actionStatus.toLowerCase()) {
      case ManageIncidentStatesEnum.ACTION_WRONG:
        returningLabel = "Error Occurred";
        break;
      case ManageIncidentStatesEnum.ACTION_PENDING:
        returningLabel = "In progress";
        break;
      case ManageIncidentStatesEnum.ACTION_COMPLETED:
        returningLabel = "Completed";
    }

    return returningLabel;
  }

  showNoteInfoBox() {
    this.isShowNoteInfoBox.set(true);
  }

  hideNoteInfoBox() {
    this.isShowNoteInfoBox.set(false);
  }

  isCurrentActionPending():boolean {
    return this.currAction?.status.toLowerCase() === ManageIncidentStatesEnum.ACTION_PENDING;
  }
}
