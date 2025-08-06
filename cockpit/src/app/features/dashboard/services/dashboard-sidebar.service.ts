import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, Subject } from "rxjs";
import { Incident } from "../models/dashboard.models";
import { convertSetToArray } from "../../../core/utils/array-functions";
import { isNonNull } from "../../../core/utils/rxjs-operators/noNullOperator";

export interface IncidentOVTableColumns {
  field: string;
  header: string;
  visible: boolean;
  sortable: boolean;
}

@Injectable({ providedIn: "root" })
export class SidebarService {
  private _incidentListSubject = new BehaviorSubject<Incident[]>([]);
  incidentListSubject = this._incidentListSubject.asObservable();

  _appliedFiltersAmountSubject = new BehaviorSubject<number>(0);
  appliedFiltersAmountSubject =
    this._appliedFiltersAmountSubject.asObservable();

  private initialDasboardTableColumnConfig: IncidentOVTableColumns[] = [
    { field: "id", header: "ID", visible: true, sortable: false },
    {
      field: "description",
      header: "Description",
      visible: true,
      sortable: true,
    },
    { field: "deck", header: "Deck", visible: true, sortable: false },
    { field: "frame", header: "Frame", visible: true, sortable: false },
    {
      field: "assetsInvolved",
      header: "Assets",
      visible: true,
      sortable: true,
    },
    {
      field: "mvz",
      header: "MVZ",
      visible: false,
      sortable: true,
    },
    { field: "severity", header: "Alert level", visible: true, sortable: true },
    { field: "createdAt", header: "Date", visible: true, sortable: true },
    {
      field: "linkToIncidentManage",
      header: "",
      visible: true,
      sortable: false,
    },
    { field: "linkToIncidentOV", header: "", visible: true, sortable: false },
  ];

  private visibleColumnsSubject = new BehaviorSubject<IncidentOVTableColumns[]>(
    this.initialDasboardTableColumnConfig
  );
  visibleColumns$ = this.visibleColumnsSubject.asObservable();

  private _currentNavigationTarget = new BehaviorSubject<string>("");
  currentNavigationTarget = this._currentNavigationTarget.asObservable();

  /**
   * parte relativa alla sidebar filters
   */

  private filtersSubject = new BehaviorSubject<any>({});
  currentFilters = this.filtersSubject.asObservable();

  private resetSubject = new Subject<void>();
  resetTriggered = this.resetSubject.asObservable();

  private _exitAnIncidentPageSubject = new Subject<void>();
  exitAnIncidentPageSubject = this._exitAnIncidentPageSubject.asObservable();

  private _incidentDetailInitiator = new BehaviorSubject<string>("");
  incidentDetailInitiator = this._incidentDetailInitiator.asObservable();

  updateIncidentList(newIncidentList: any) {
    this._incidentListSubject.next(newIncidentList);
  }

  updateAppliedFiltersCount(currentActiveFiltersCount: number) {
    this._appliedFiltersAmountSubject.next(currentActiveFiltersCount);
  }

  updateVisibleColumns(selectedColumns: IncidentOVTableColumns[]) {
    let newDashboardTBColumnsConfig: IncidentOVTableColumns[] = [
      ...this.initialDasboardTableColumnConfig,
    ];

    const recalculatedConfig = newDashboardTBColumnsConfig.map(
      (dashboardTBColumnConfig) => {
        let calculatedDashboardTBColumnConfig: IncidentOVTableColumns;
        if (
          selectedColumns.some(
            (selectedColum) =>
              selectedColum.field === dashboardTBColumnConfig.field
          )
        ) {
          calculatedDashboardTBColumnConfig = {
            ...dashboardTBColumnConfig,
            visible: true,
          };
        } else {
          calculatedDashboardTBColumnConfig = {
            ...dashboardTBColumnConfig,
            visible: false,
          };
        }

        return calculatedDashboardTBColumnConfig;
      }
    );

    newDashboardTBColumnsConfig = [...recalculatedConfig];

    this.visibleColumnsSubject.next(newDashboardTBColumnsConfig);
  }

  resetVisibleColumnsInitialConfig() {
    this.visibleColumnsSubject.next(this.initialDasboardTableColumnConfig);
  }

  getInitialColumnsConfig(): IncidentOVTableColumns[] {
    return this.initialDasboardTableColumnConfig;
  }

  updateCurrentNavigationTarget(newTargetPage: any) {
    this._currentNavigationTarget.next(newTargetPage);
  }

  resetFiltersCount(): void {
    this._appliedFiltersAmountSubject.next(0);
  }

  updateFilters(newFilters: any) {
    this.filtersSubject.next(newFilters);
  }

  updateIncidentDetailInitiator(initiatorPage: string) {
    this._incidentDetailInitiator.next(initiatorPage);
  }

  triggerReset() {
    this.resetSubject.next();
    this.resetFiltersCount();
    //this.updateFilters(null);
  }

  leavingAnIncidentPage() {
    this._exitAnIncidentPageSubject.next();
  }

  getIncidentsDescriptionOptions(): Observable<string[]> {
    return this.incidentListSubject.pipe(
      map((incidents) => {
        if (!Array.isArray(incidents)) return [];

        return incidents
          .map((incident) => incident?.description) // Estrai le descrizioni
          .filter((desc): desc is string => !!desc) // Filtra valori null/undefined
          .filter((desc, index, array) => array.indexOf(desc) === index); // Rimuovi duplicati
      })
    );
  }

  getIncidentsAlertsLevelOptions(): Observable<any> {
    return this.incidentListSubject.pipe(
      map((incidents) => incidents.map((incident) => incident?.severity))
    );
  }

  getIncidentsDeckOptions(): Observable<string[]> {
    return this.incidentListSubject.pipe(
      map((incidents) => {
        if (!Array.isArray(incidents)) return [];

        const decksSet = new Set<string>();

        incidents?.forEach((incident) => {
          incident?.decks?.forEach((deck) => {
            decksSet.add(String(deck));
          });
        });

        return Array.from(decksSet).sort((a, b) => parseInt(a) - parseInt(b));
      })
    );
  }

  getIncidentsFrameOptions(): Observable<string[]> {
    return this.incidentListSubject.pipe(
      map((incidents) => {
        if (!Array.isArray(incidents)) return [];

        const framessSet = new Set<string>();

        incidents?.forEach((incident) => {
          incident?.frames?.forEach((frame) => {
            framessSet.add(String(frame));
          });
        });

        return Array.from(framessSet).sort((a, b) => parseInt(a) - parseInt(b));
      })
    );
  }

  getIncidentsMVZOptions(): Observable<string[]> {
    return this.incidentListSubject.pipe(
      map((incidents) => incidents?.map((incident) => incident?.mvz)),
      map((mvzArr) => {
        const mvzListSet: Set<string> = new Set();

        mvzArr?.forEach((mvzList) =>
          mvzList?.forEach((mvz) => {
            if (!mvzListSet.has(String(mvz))) {
              mvzListSet.add(String(mvz));
            }
          })
        );

        return convertSetToArray(mvzListSet).sort(
          (a, b) => parseInt(a) - parseInt(b)
        );
      })
    );
  }
}
