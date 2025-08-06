import { Component, computed, effect, inject, Input, signal } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { Action } from "../../../features/incident-detail/models/incident-detail.models";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { GenericTooltipInfoBoxComponent } from "../generic-tooltip-info-box/generic-tooltip-info-box.component";
import {
  ActionTypes,
  ManageIncidentStatesEnum,
} from "../../enums/manage-incident-states.enum";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromIncidentDetail } from "../../state";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-stepper-action-note",
  imports: [SharedModule, GenericTooltipInfoBoxComponent],
  templateUrl: "./stepper-action-note.component.html",
  styleUrl: "./stepper-action-note.component.scss",
})
export class StepperActionNoteComponent {
  private store = inject(Store);
  isShowNoteInfoBox = signal<boolean>(false);

  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  _currentAction = signal<Action | null>(null);
  @Input() set currentAction(currentAction: Action|null) {
    if(currentAction){
      this._currentAction.set(currentAction);
    }
  }

  get currAction() {
    return this._currentAction();
  }
  noteMaxLength = 500;

  _isStepperInReadonlyMode = signal<boolean>(false);
  @Input() set isStepperInReadonly(isReadonlyModeActive: boolean) {
    this._isStepperInReadonlyMode.set(isReadonlyModeActive);
  }

  get isReadOnlyModeActive() {
    return this._isStepperInReadonlyMode();
  }

  textArea = signal<string>("");
  falsePositiveEventNote = signal<string>("");

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  isCurrentEventMarkedAsFalsePositive = computed(() => {
    const currentlySelectedEvent = this.incidentManagementManagerService._currentStepperActiveEventIndex.value;
    return this.allIncidents()[0].events[currentlySelectedEvent].status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED;
  })

  currentlyFalsePositiveEventNote  = computed(() => {
    const currentlySelectedEvent = this.incidentManagementManagerService._currentStepperActiveEventIndex.value;
    return this.allIncidents()[0].events[currentlySelectedEvent].remediation?.actions[0]?.note
  })

  get falsePositiveCurrentEventNote() {
    return this.currentlyFalsePositiveEventNote()
  }

  constructor() {
    effect(() => {
      this.incidentManagementManagerService.updateCurrentStepNote(
        this.textArea()
      );

      if(this.isCurrentEventMarkedAsFalsePositive()){
        this.falsePositiveEventNote.set(this.falsePositiveCurrentEventNote)
      }
    });
  }

  showNoteInfoBox() {
    this.isShowNoteInfoBox.set(true);
  }

  hideNoteInfoBox() {
    this.isShowNoteInfoBox.set(false);
  }

  chechIfNoteIsVisible(currentAction: Action): boolean {
    return (
      ((currentAction?.actionType.toLowerCase() !== ActionTypes.ACTION_ASSISTED) || 
      (currentAction?.actionType.toLowerCase() === ActionTypes.ACTION_ASSISTED &&
      currentAction?.status.toLowerCase() ===
        ManageIncidentStatesEnum.ACTION_COMPLETED))
    );
  }
}
