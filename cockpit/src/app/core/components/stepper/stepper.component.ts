import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  QueryList,
  signal,
  ViewChildren,
} from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { StepperModule } from "primeng/stepper";
import { ButtonModule } from "primeng/button";
import {
  Action,
  IncidentEvent,
} from "../../../features/incident-detail/models/incident-detail.models";
import { MarkerComponent } from "../marker/marker.component";
import { IconActionPathMap } from "../../models/iconDictionary.model";
import { Store } from "@ngrx/store";
import { markEventFalsePositiveActions } from "../../state/actions";
import {
  fromIncidentDetail,
  selectIncidentManagementActions,
} from "../../state";
import { PollingService } from "../../services/polling.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { MarkEventAsFalsePositiveRequest } from "../../models/mark-event-as-false-positive.model";
import { GenericHintComponent } from "../generic-hint/generic-hint.component";
import { StepperActionDetailsComponent } from "../stepper-action-details/stepper-action-details.component";
import { StepperActionNoteComponent } from "../stepper-action-note/stepper-action-note.component";
import { StepperCallToActionBarComponent } from "../stepper-call-to-action-bar/stepper-call-to-action-bar.component";
import { ManageIncidentStatesEnum } from "../../enums/manage-incident-states.enum";

@Component({
  selector: "app-stepper",
  imports: [
    SharedModule,
    StepperModule,
    ButtonModule,
    MarkerComponent,
    GenericHintComponent,
    StepperActionDetailsComponent,
    StepperActionNoteComponent,
    StepperCallToActionBarComponent,
  ],
  templateUrl: "./stepper.component.html",
  styleUrl: "./stepper.component.scss",
})
export class StepperComponent implements AfterViewInit {
  @ViewChildren("stepperButtons") stepperButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;
  private store = inject(Store);
  private pollingService = inject(PollingService);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  noteMaxLength = 500;
  actions!: Action[];
  private _currentEvent = signal<IncidentEvent | null>(null);

  @Input() set currentEvent(currentEvent: IncidentEvent | null) {
    this._currentEvent.set(currentEvent);
  }
  get currentEvent() {
    return this._currentEvent();
  }

  textArea: string = "";
  initialTextArea: string = "";
  iconActionMap = IconActionPathMap;

  isRemediationImpactsModalOpen = false;
  isWarningComponentVisible = false;

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  isCurrentlySelectedEventMarkedAsFalsePositive = computed(() => {
    const currentlySelectedEvent =
      this.incidentManagementManagerService._currentStepperActiveEventIndex
        .value;
    return (
      this.currentStepperSelectedEvent() !== -1 &&
      this.allIncidents()[0].events[
        currentlySelectedEvent
      ]?.status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED
    );
  });

  // testActions = computed(() => {
  //   let currentlyUpdatedStepperActions: Action[] = [];
  //   if(this.currentStepperSelectedEvent() !== -1){
  //     currentlyUpdatedStepperActions = this.incidentManagementManagerService.getCurrentStepperActions(this.allIncidents()[0]);
  //   }
  //   return currentlyUpdatedStepperActions;
  // });

  incidentManagedAction = toSignal(
    this.store.select(selectIncidentManagementActions),
    {
      initialValue: [],
    }
  );

  currentStepperSelectedAction = toSignal(
    this.incidentManagementManagerService.currentStepperActiveActionIndex,
    {
      initialValue: 0,
    }
  );

  isMarkIncidentAsFalsePositiveRequested = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveRequired,
    {
      initialValue: false,
    }
  );

  get isMarkIncidentAsFalsePositiveRequired() {
    return this.isMarkIncidentAsFalsePositiveRequested();
  }

  get selectedStepperAction() {
    return this.currentStepperSelectedAction();
  }

  set selectedStepperAction(value: number) {
    this.incidentManagementManagerService.updateCurrentStepperActiveActionIndex(
      value
    );
  }

  currentStepperSelectedEvent = toSignal(
    this.incidentManagementManagerService.currentStepperActiveEventIndex,
    {
      initialValue: -1,
    }
  );

  get currentSelectedIncident() {
    return this.allIncidents()[0];
  }

  isReadOnlyMode = signal<boolean>(false);

  constructor() {
    // this.incidentManagementManagerService.updateCurrentStepperActiveEventIndex(0);

    effect(() => {
      // if (
      //   this.pollingService
      //     .getRegisteredActionIds()
      //     .some(
      //       (inProgressActionId) =>
      //         Number(inProgressActionId) === this.incidentManagedAction()[0].id
      //     )
      // ) {
      //   this.pollingService.unregisterPollingCallback(
      //     `triggerIncidentDetailUpdateNr${this.currentIncidentIdSignal()}Action${
      //       this.incidentManagedAction()[0].id
      //     }`
      //   );
      // }

      if (this.currentStepperSelectedEvent() !== -1) {
        //this.manageFalsePositiveContext();
        this.manageWarningComponentVisibility();
        this.getUpdatedStepperActions();

        this.isReadOnlyMode.set(
          this.incidentManagementManagerService.checkIfCurrentStepperIsReadOnly(
            this.currentSelectedIncident
          )
        );
      }

      if (this.isMarkIncidentAsFalsePositiveRequired) {
        this.manageWarningComponentVisibility();
      }
    });
  }

  ngAfterViewInit(): void {
    this.checkIfStepperButtonsAreDisabled();
    this.textArea = this.actions[this.currentStepperSelectedAction()]?.note;
  }

  getUpdatedStepperActions() {
    this.actions =
      this.incidentManagementManagerService.getCurrentStepperActions(
        this.allIncidents()[0]
      );
  }

  // manageFalsePositiveContext() {
  //   if (
  //     this.incidentManagementManagerService.checkIfCurrentStepperIsFalsePositive(
  //       this.allIncidents()[0]
  //     )
  //   ) {
  //     this.enableFalsePositiveMode();
  //   } else {
  //     this.disableFalsePositiveMode();
  //   }
  // }

  manageWarningComponentVisibility() {
    if (
      this.incidentManagementManagerService.checkIfWarningHintIsVisibleInCurrentEvent(
        this.allIncidents()[0]
      )
    ) {
      this.isWarningComponentVisible = true;
    } else {
      this.isWarningComponentVisible = false;
    }
  }

  private checkIfStepperButtonsAreDisabled() {
    const remediationButtons = this.stepperButtons.toArray();

    if (this.actions && this.actions.length) {
      this.actions?.forEach((action, index) => {
        if (action && this.isReadOnlyMode()) {
          remediationButtons[index].nativeElement.disabled = true;
        } else {
          remediationButtons[index].nativeElement.disabled = false;
        }
      });
    }
  }

  onStepClick(index: number) {
    if (
      this.isReadOnlyMode() ||
      index === this.currentStepperSelectedAction()
    ) {
      this.incidentManagementManagerService.updateCurrentStepperActiveActionIndex(
        index
      );
      this.incidentManagementManagerService.updateCurrentActiveStep(
        this.actions[index]
      );
    }
  }

  get isTextAreaChanged(): boolean {
    return this.textArea?.trim() !== this.initialTextArea?.trim();
  }

  getMarkerShape(action: Action, isSelected: boolean): "diamond" | "rounded" {
    if (isSelected) return "diamond";
    const status = action.status?.toLowerCase();
    return status === "new" || status === "pending" ? "rounded" : "diamond";
  }

  getMarkerIcon(action: Action, isSelected: boolean): string {
    const status = action.status?.toLowerCase();
    const type = action.actionType?.toLowerCase();

    const staticStatuses = ["completed", "ignored", "rollbacked"];

    if (isSelected) {
      if (staticStatuses.includes(status)) {
        return this.iconActionMap[
          `${status}Dark` as keyof typeof this.iconActionMap
        ];
      }

      if (["automated", "human", "assisted"].includes(type)) {
        return this.iconActionMap[
          `${type}Dark` as keyof typeof this.iconActionMap
        ];
      }
    }

    if (status === "new" || status === "pending") {
      return this.iconActionMap[type];
    }

    return this.iconActionMap[status];
  }

  isActionCompleted(action: Action): boolean {
    const status = action.status?.toLowerCase();

    return status !== "new" && status !== "pending";
  }

  // enableFalsePositiveMode(): void {
  //   const note = this.actions[0]?.note || "";
  //   this.textArea = note;
  //   this.initialTextArea = note;
  // }

  // disableFalsePositiveMode(): void {
  //   // this.falsePositiveCancelled.emit();
  //   // this.loadNote();
  // }

  onMarkFalsePositive(): void {
    const markEventAsFalsePositiveReq: MarkEventAsFalsePositiveRequest = {
      id: this.currentEvent?.id ?? 0,
      note: this.textArea,
    };

    this.store.dispatch(
      markEventFalsePositiveActions.markEventAsFalsePositiveActions({
        markEventAsFalsePositiveRequest: markEventAsFalsePositiveReq,
      })
    );
  }

  formatActionsFeatures(stringToFormat: string): string {
    return stringToFormat.toUpperCase();
  }

  checkIfActionStatusIsInProgress(action: Action): boolean {
    return action.status.toLowerCase() === "in progress";
  }
}
