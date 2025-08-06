import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import {
  RemediationItem,
  RemediationManagementTableColumns,
} from "../models/remediation-management.models";

@Injectable({
  providedIn: "root",
})
export class RemediationSidebarService {
  constructor() {}
  
  _lastRollbackedActionId = new BehaviorSubject<number>(-1);
  lastRollbackedActionId = this._lastRollbackedActionId.asObservable();

  updateLastRollbackedActionId(lastRollbackedActionId: number) {
    this._lastRollbackedActionId.next(lastRollbackedActionId);
  }

  private resetSubject = new BehaviorSubject<boolean>(false);
  resetTriggered = this.resetSubject.asObservable();

  private filtersSubject = new BehaviorSubject<any>({});
  currentFilters = this.filtersSubject.asObservable();

  private _remediationListSubject = new BehaviorSubject<RemediationItem[]>([]);
  remediationListSubject = this._remediationListSubject.asObservable();

  private initialRemediationsTableColumnConfig: RemediationManagementTableColumns[] =
    [
      {
        field: "incidentId",
        header: "ID",
        visible: true,
        sortable: false,
      },
      {
        field: "incidentDescription",
        header: "INCIDENT DESCRIPTION",
        visible: true,
        sortable: true,
      },
      {
        field: "actionType",
        header: "ACTION TYPE",
        visible: true,
        sortable: true,
      },

      {
        field: "actionDescription",
        header: "ACTION DESCRIPTION",
        visible: true,
        sortable: true,
      },
      {
        field: "status",
        header: "STATUS",
        visible: true,
        sortable: true,
      },
      {
        field: "action",
        header: "",
        visible: true,
        sortable: false,
      },
    ];

  private visibleColumnsRemediationSubject = new BehaviorSubject<
    RemediationManagementTableColumns[]
  >(this.initialRemediationsTableColumnConfig);

  visibleColumns$ =
    this.visibleColumnsRemediationSubject.asObservable();

  private _appliedFiltersAmountSubject = new BehaviorSubject<number>(0);
  appliedFiltersAmountSubject =
    this._appliedFiltersAmountSubject.asObservable();

   updateVisibleColumns(selectedColumns: RemediationManagementTableColumns[]) {
      let newRemediationTBColumnsConfig: RemediationManagementTableColumns[] = [
        ...this.initialRemediationsTableColumnConfig,
      ];
  
      const recalculatedConfig = newRemediationTBColumnsConfig.map(
        (remediationsTBColumnConfig) => {
          let calculatedRemediationsTBColumnConfig: RemediationManagementTableColumns;
          if (
            selectedColumns.some(
              (selectedColum) =>
                selectedColum.field === remediationsTBColumnConfig.field
            )
          ) {
            calculatedRemediationsTBColumnConfig = {
              ...remediationsTBColumnConfig,
              visible: true,
            };
          } else {
            calculatedRemediationsTBColumnConfig = {
              ...remediationsTBColumnConfig,
              visible: false,
            };
          }
  
          return calculatedRemediationsTBColumnConfig;
        }
      );
  
      newRemediationTBColumnsConfig = [...recalculatedConfig];
      this.visibleColumnsRemediationSubject.next(newRemediationTBColumnsConfig);
    }

  updateAppliedFiltersCount(currentActiveFiltersCount: number) {
    this._appliedFiltersAmountSubject.next(currentActiveFiltersCount);
  }

  resetFiltersCount(): void {
    this._appliedFiltersAmountSubject.next(0);
  }

  resetVisibleColumnsInitialConfig() {
    this.visibleColumnsRemediationSubject.next(
      this.initialRemediationsTableColumnConfig
    );
  }

  updateRemediationList(newRemediationList: any) {
    this._remediationListSubject.next(newRemediationList);
  }

  getInitialColumnsConfig(): RemediationManagementTableColumns[] {
    return this.initialRemediationsTableColumnConfig;
  }

  getRemediationIdOptions(): Observable<string[]> {
    return this.remediationListSubject.pipe(
      map((remediation) =>
        remediation.map((remediations) => String(remediations?.actionId))
      )
    );
  }

   getRemediationActionTypeOptions(): Observable<string[]> {
    return this.remediationListSubject.pipe(
      map((remediations) =>
        remediations.map((remediations) => remediations?.actionType)
      )
    );
  }
  
  getRemediationIncidentDescriptionOptions(): Observable<string[]> {
    return this.remediationListSubject.pipe(
      map((remediations) => {
        if (!Array.isArray(remediations)) return [];

        return remediations
          .map((remediation) => remediation?.incidentDescription)
          .filter((desc): desc is string => !!desc)
          .filter((desc, index, array) => array.indexOf(desc) === index);
      })
    );
  }

  getRemediationActionDescriptionOptions(): Observable<string[]> {
    return this.remediationListSubject.pipe(
      map((remediations) => {
        if (!Array.isArray(remediations)) return [];

        return remediations
          .map((remediation) => remediation?.description)
          .filter((desc): desc is string => !!desc)
          .filter((desc, index, array) => array.indexOf(desc) === index);
      })
    );
  }

  getRemediationStatusOptions(): Observable<string[]> {
    return this.remediationListSubject.pipe(
      map((remediations) =>
        remediations.map((remediations) => remediations?.status)
      )
    );
  }

  updateFilters(newFilters: any) {
    this.filtersSubject.next(newFilters);
  }

  triggerReset() {
    this.resetSubject.next(true);
  }
}
