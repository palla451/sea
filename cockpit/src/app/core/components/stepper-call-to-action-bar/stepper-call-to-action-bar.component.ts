import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
} from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { Action } from "../../../features/incident-detail/models/incident-detail.models";
import {
  ActionTypes,
  ManageIncidentStatesEnum,
} from "../../enums/manage-incident-states.enum";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  fromIncidentDetail,
  markEventAsFalsePositiveFeature,
} from "../../state";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import {
  incidentDetailActions,
  IncidentManagementActions,
  markEventFalsePositiveActions,
} from "../../state/actions";
import { MarkEventAsFalsePositiveRequest } from "../../models/mark-event-as-false-positive.model";
import { IncidentManagementModalRequest } from "../../models/incident-management-modal.model";
import { PollingService } from "../../services/polling.service";
import { shipFunctionsActions } from "../../../features/dashboard/state/actions";

@Component({
  selector: "app-stepper-call-to-action-bar",
  imports: [SharedModule],
  templateUrl: "./stepper-call-to-action-bar.component.html",
  styleUrl: "./stepper-call-to-action-bar.component.scss",
})
export class StepperCallToActionBarComponent {
  private pollingService = inject(PollingService);
  private store = inject(Store);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );
  _currentAction = signal<Action | null>(null);
  @Input() set currentAction(currentAction: Action | null) {
    if (currentAction) {
      this._currentAction.set(currentAction);
    }
  }

  get currAction() {
    return this._currentAction();
  }

  currentStepperSelectedEvent = toSignal(
    this.incidentManagementManagerService.currentStepperActiveEventIndex,
    {
      initialValue: -1,
    }
  );

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  lastEventMarkedAsFalsePositiveSuccess = toSignal(
    this.store.select(
      markEventAsFalsePositiveFeature.selectMarkEventAsFalsePositiveResponse
    ),
    {
      initialValue: null,
    }
  );

  get currentSelectedIncident() {
    return this.allIncidents()[0];
  }

  isReadOnlyMode = signal<boolean>(false);

  currentStepActionNote = toSignal(
    this.incidentManagementManagerService._currentStepUpdatedNote,
    {
      initialValue: "",
    }
  );

  isMarkAsFalsePositiveRequired = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveRequired,
    {
      initialValue: false,
    }
  );

  isProceedAndMarkAsFalsePositiveActive = computed(() => {
    return (
      !!this.currentStepActionNote() && this.currentStepActionNote() !== ""
    );
  });

  currentSelectedEventID = computed(() => {
    const currentSelectedEventIndex =
      this.incidentManagementManagerService._currentStepperActiveEventIndex
        ?.value;
    return this.allIncidents()[0]?.events[currentSelectedEventIndex]?.id;
  });

  isCurrentlySelectedEventMarkedAsFalsePositive = computed(() => {
    const currentlySelectedEvent =
      this.incidentManagementManagerService._currentStepperActiveEventIndex
        .value;
    return (
      this.currentStepperSelectedEvent() !== -1 &&
      this.allIncidents()[0].events[
        currentlySelectedEvent
      ].status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED
    );
  });

  isCurrentStepCTAActive = computed(() => {
    return (
      !!this._currentAction() &&
      ((this._currentAction()?.status.toLowerCase() ===
        ManageIncidentStatesEnum.ACTION_NEW &&
        this._currentAction()?.actionType.toLowerCase() ===
          ActionTypes.ACTION_HUMAN &&
        this.currentStepActionNote() !== "") ||
        (this._currentAction()?.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_NEW &&
          this._currentAction()?.actionType.toLowerCase() ===
            ActionTypes.ACTION_AUTOMATED) ||
        ((this._currentAction()?.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_NEW ||
          this._currentAction()?.status.toLowerCase() ===
            ManageIncidentStatesEnum.ACTION_WRONG ||
          this._currentAction()?.status.toLowerCase() ===
            ManageIncidentStatesEnum.ACTION_COMPLETED ||
          this._currentAction()?.status.toLowerCase() ===
            ManageIncidentStatesEnum.ACTION_ROLLBACKED) &&
          this._currentAction()?.actionType.toLowerCase() ===
            ActionTypes.ACTION_ASSISTED))
    );
  });

  constructor() {
    effect(() => {
      this.isReadOnlyMode.set(
        this.incidentManagementManagerService.checkIfCurrentStepperIsReadOnly(
          this.currentSelectedIncident
        )
      );

      if (
        this.lastEventMarkedAsFalsePositiveSuccess() &&
        this.lastEventMarkedAsFalsePositiveSuccess()?.id &&
        this.lastEventMarkedAsFalsePositiveSuccess()?.status.toLowerCase() ===
          ManageIncidentStatesEnum.EVENT_REJECTED
      ) {
        this.incidentManagementManagerService.updateIsMarkAsFalsePositiveRequired(
          false
        );
      }
    });
  }

  openRemediationImpactModal() {
    this.incidentManagementManagerService.updateIsBaseReadOnlyModalOpen(true);
    //this.isRemediationImpactsModalOpen = true;
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
    this.incidentManagementManagerService.updateIsRemediationImpactModalOpen(
      true
    );
  }

  getActionButtonLabel(action: Action): string {
    const type = action.actionType?.toLowerCase();
    const status = action.status?.toLowerCase();

    let returningLabel = "common.button.proceed";

    switch (type) {
      case ActionTypes.ACTION_AUTOMATED:
        returningLabel = "common.button.acknowledge";
        break;

      case ActionTypes.ACTION_HUMAN:
        returningLabel = "common.button.proceed";
        break;

      case ActionTypes.ACTION_ASSISTED:
        if (status === ManageIncidentStatesEnum.ACTION_COMPLETED) {
          returningLabel = "common.button.proceed";
        } else if (status === ManageIncidentStatesEnum.ACTION_WRONG) {
          returningLabel = "remediationManagementModal.stepper.assisted.retry";
        } else {
          returningLabel = "remediationManagementModal.stepper.assisted.apply";
        }
        break;
    }

    return returningLabel;
  }

  get isTextAreaChanged(): boolean {
    //return this.textArea?.trim() !== this.initialTextArea?.trim();
    return false;
  }

  isActionButtonDisabled(action: Action): boolean {
    const type = action.actionType?.toLowerCase();
    const status = action.status?.toLowerCase();

    if (type === "human") {
      return !this.isTextAreaChanged;
    }

    if (type === "assisted") {
      return status === "progress";
    }

    return false;
  }

  onPanelButtonClick(action: Action) {
    const currentStepRequest: IncidentManagementModalRequest = {
      actionId: action?.id,
      note: this.currentStepActionNote(),
      retryCounter:
        this.incidentManagementManagerService
          ._manageIncidentRemediationStepperAPICounter?.value ?? 0,
    };
    // this.pollingService.registerPollingCallback(
    //   `triggerIncidentDetailUpdateNr${String(
    //     this.allIncidents()[0]?.id
    //   )}Action${action.id}`,
    //   () => {
    //     this.store.dispatch(
    //       incidentDetailActions.getAllIncidentDetail({
    //         incidentId: String(this.allIncidents()[0]?.id),
    //       })
    //     );
    //   }
    // );
    this.store.dispatch(
      IncidentManagementActions.updateIncidentManagementActions({
        actionStep: currentStepRequest,
      })
    );
  }

  disableFalsePositiveMode(): void {
    this.incidentManagementManagerService.updateIsMarkAsFalsePositiveRequired(
      false
    );
  }

  onMarkFalsePositive(): void {
    const markEventAsFalsePositiveRequest: MarkEventAsFalsePositiveRequest = {
      id: this.currentSelectedEventID(),
      note: this.incidentManagementManagerService._currentStepUpdatedNote
        ?.value,
    };

    this.store.dispatch(
      markEventFalsePositiveActions.markEventAsFalsePositiveActions({
        markEventAsFalsePositiveRequest,
      })
    );
    this.incidentManagementManagerService.updateIsMarkAsFalsePositiveAccepted(
      true
    );
  }
}
