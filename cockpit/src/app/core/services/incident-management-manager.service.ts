import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  Action,
  IncidentDetail,
  IncidentEvent,
} from "../../features/incident-detail/models/incident-detail.models";
import { Incident } from "../../features/dashboard/models/dashboard.models";
import {
  ActionTypes,
  ManageIncidentStatesEnum,
} from "../enums/manage-incident-states.enum";
import { IconEventPathMap } from "../models/iconDictionary.model";

@Injectable({
  providedIn: "root",
})
export class IncidentManagementManagerService {
  _overviewIncidentTableCurrPageImpactedDecks = new BehaviorSubject<number[]>([]);
  overviewIncidentTableCurrPageImpactedDecks =
    this._overviewIncidentTableCurrPageImpactedDecks.asObservable();

  updateIncidentOvTableCurrPageImpactedDecks(impactedDecks: number[]) {
    this._overviewIncidentTableCurrPageImpactedDecks.next(impactedDecks);
  }

  _manageIncidentRemediationStepperAPICounter = new BehaviorSubject<number>(0);
  manageIncidentRemediationStepperAPICounter =
    this._manageIncidentRemediationStepperAPICounter.asObservable();

  updateIncidentRemediationStepperAPICounter(incidentRemediationStepperAPICounter: number) {
    this._manageIncidentRemediationStepperAPICounter.next(incidentRemediationStepperAPICounter);
  }

  private _isRemediationImpactModalOpen = new BehaviorSubject<boolean>(false);
  isRemediationImpactModalOpen =
    this._isRemediationImpactModalOpen.asObservable();

  updateIsRemediationImpactModalOpen(isRemediationImpactModalOpen: boolean) {
    this._isRemediationImpactModalOpen.next(isRemediationImpactModalOpen);
  }

  private _isIncidentManagementModalOpen = new BehaviorSubject<boolean>(false);
  isIncidentManagementModalOpen =
    this._isIncidentManagementModalOpen.asObservable();

  updateIsIncidentManagementModalOpen(isIncidentManagementModalOpen: boolean) {
    this._isIncidentManagementModalOpen.next(isIncidentManagementModalOpen);
  }

  _isBaseReadOnlyModalOpen = new BehaviorSubject<boolean>(false);
  isBaseReadOnlyModalOpen =
    this._isBaseReadOnlyModalOpen.asObservable();

  updateIsBaseReadOnlyModalOpen(isBaseReadOnlyModalOpen: boolean) {
    this._isBaseReadOnlyModalOpen.next(isBaseReadOnlyModalOpen);
  }

  private _isMarkAsFalsePositiveRequired = new BehaviorSubject<boolean>(false);
  isMarkAsFalsePositiveRequired =
    this._isMarkAsFalsePositiveRequired.asObservable();

  updateIsMarkAsFalsePositiveRequired(isMarkAsFalsePositiveRequired: boolean) {
    this._isMarkAsFalsePositiveRequired.next(isMarkAsFalsePositiveRequired);
  }

  private _isMarkAsFalsePositiveAccepted = new BehaviorSubject<boolean>(false);
  isMarkAsFalsePositiveAccepted =
    this._isMarkAsFalsePositiveAccepted.asObservable();

  updateIsMarkAsFalsePositiveAccepted(isMarkAsFalsePositiveAccepted: boolean) {
    this._isMarkAsFalsePositiveAccepted.next(isMarkAsFalsePositiveAccepted);
  }

  private _currentStepperEventSelected = new BehaviorSubject<string>("");
  currentStepperEventSelected =
    this._currentStepperEventSelected.asObservable();

  updateCurrentStepperEventSelected(currentStepperEventSelected: string) {
    this._currentStepperEventSelected.next(currentStepperEventSelected);
  }

  private _currentActiveStep = new BehaviorSubject<Action | null>(null);
  currentActiveStep = this._currentActiveStep.asObservable();

  updateCurrentActiveStep(currentActiveStep: Action | null) {
    this._currentActiveStep.next(currentActiveStep);
  }

   _currentStepperActiveEventIndex = new BehaviorSubject<number>(-1);
  currentStepperActiveEventIndex =
    this._currentStepperActiveEventIndex.asObservable();

  updateCurrentStepperActiveEventIndex(currentStepperActiveEventIndex: number) {
    this._currentStepperActiveEventIndex.next(currentStepperActiveEventIndex);
  }

  private _currentStepperActiveActionIndex = new BehaviorSubject<number>(-1);
  currentStepperActiveActionIndex =
    this._currentStepperActiveActionIndex.asObservable();

  updateCurrentStepperActiveActionIndex(
    currentStepperActiveActionIndex: number
  ) {
    this._currentStepperActiveActionIndex.next(currentStepperActiveActionIndex);
  }

  _currentStepUpdatedNote = new BehaviorSubject<string>('');
  currentStepUpdatedNote =
    this._currentStepUpdatedNote.asObservable();

  updateCurrentStepNote(
    updatedNote: string
  ) {
    this._currentStepUpdatedNote.next(updatedNote);
  }

  getCurrentIncidentSteperLength(
    currentIncidentTriggered: IncidentDetail
  ): number {
    const currentlySelectedEventIndex =
      this._currentStepperActiveEventIndex.value;

    return currentIncidentTriggered?.events[currentlySelectedEventIndex]
      ?.remediation?.actions.length;
  }

  setStepperToInitialState(currentIncidentTriggered: IncidentDetail) {
    const currentSelectedEventIndex = this._currentStepperActiveEventIndex.value;
    //this.updateCurrentStepperActiveEventIndex(0);
    if (
      currentIncidentTriggered?.events[currentSelectedEventIndex]?.remediation?.status.toLowerCase() ===
        ManageIncidentStatesEnum.REMEDIATION_REJECTED ||
      currentIncidentTriggered?.events[currentSelectedEventIndex]?.remediation?.status.toLowerCase() ===
        ManageIncidentStatesEnum.REMEDIATION_DONE
    ) {
      this.updateCurrentStepperActiveActionIndex(0);
    } else {
      const firstIncompleteStep =
        currentIncidentTriggered?.events[currentSelectedEventIndex]?.remediation?.actions.findIndex(
          (action) =>
            action?.status.toLowerCase() ===
              ManageIncidentStatesEnum.ACTION_NEW ||
            action?.status.toLowerCase() ===
              ManageIncidentStatesEnum.ACTION_PENDING ||
            action?.status.toLowerCase() ===
              ManageIncidentStatesEnum.ACTION_ROLLBACKED ||
            action?.status.toLowerCase() ===
              ManageIncidentStatesEnum.ACTION_WRONG
        );

      if (firstIncompleteStep > -1) {
        this.updateCurrentStepperActiveActionIndex(firstIncompleteStep);
      }
    }
  }

  incrementStepperState(currentIncidentTriggered: IncidentDetail) {
    const maxStepperIndexValue =
      this.getCurrentIncidentSteperLength(currentIncidentTriggered) - 1;

    if (this._currentStepperActiveActionIndex.value < maxStepperIndexValue) {
      this.updateCurrentStepperActiveActionIndex(
        this._currentStepperActiveActionIndex.value + 1
      );
    }
  }

  decrementStepperState() {
    if (this._currentStepperActiveActionIndex.value > 0) {
      this.updateCurrentStepperActiveActionIndex(
        this._currentStepperActiveActionIndex.value - 1
      );
    }
  }

  checkIfCurrentStepperIsReadOnly(
    currentIncidentTriggered: IncidentDetail
  ): boolean {
    const currentSelectedEventIndex =
      this._currentStepperActiveEventIndex.value;

    return (
      currentIncidentTriggered?.events[
        currentSelectedEventIndex
      ]?.status.toLowerCase() === ManageIncidentStatesEnum.EVENT_DONE ||
      currentIncidentTriggered?.events[
        currentSelectedEventIndex
      ]?.status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED
    );
  }

  checkIfCurrentStepperIsFalsePositive(
    currentIncidentTriggered: IncidentDetail
  ): boolean {
    const currentSelectedEventIndex =
      this._currentStepperActiveEventIndex.value;

    return (
      currentIncidentTriggered?.events[
        currentSelectedEventIndex
      ]?.status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED
    );
  }

  getCurrentStepperActions(currentIncidentTriggered: IncidentDetail): Action[] {
    const currentlySelectedEventIndex =
      this._currentStepperActiveEventIndex.value;

    return currentIncidentTriggered?.events[currentlySelectedEventIndex]
      ?.remediation?.actions;
  }

  getEventStatusIcon(event: IncidentEvent): string | null {
    const status = event.status?.toLowerCase();
    return IconEventPathMap[status] ?? null;
  }

  checkIfCurrentEventIsFalsePositive(
    currentIncidentTriggered: IncidentDetail
  ): boolean {
    const currentlySelectedEventIndex =
      this._currentStepperActiveEventIndex.value;

    return (
      currentIncidentTriggered?.events[currentlySelectedEventIndex]?.status ===
      ManageIncidentStatesEnum.EVENT_REJECTED
    );
  }

  checkIfWarningHintIsVisibleInCurrentEvent(
    currentIncidentTriggered: IncidentDetail
  ): boolean {

    const currentlySelectedActionIndex =
      this._currentStepperActiveActionIndex.value;
    const currentlyTriggeredAction = this.getCurrentStepperActions(
      currentIncidentTriggered
    )[currentlySelectedActionIndex];

    return (
      ((currentlyTriggeredAction?.status.toLowerCase() ===
        ManageIncidentStatesEnum.ACTION_PENDING ||
        currentlyTriggeredAction?.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_NEW ||
        currentlyTriggeredAction?.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_WRONG) &&
        currentlyTriggeredAction?.actionType.toLowerCase() === ActionTypes.ACTION_ASSISTED) ||
      this.checkIfCurrentEventIsFalsePositive(currentIncidentTriggered) ||
      this._isMarkAsFalsePositiveRequired.value
    );
  }
}
