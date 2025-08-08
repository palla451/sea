import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Incident } from "../../dashboard/models/dashboard.models";
import { convertSetToArray } from "../../../core/utils/array-functions";

export interface HistoryTableColumns {
  field: string;
  header: string;
  visible: boolean;
  sortable: boolean;
}
@Injectable({
  providedIn: "root",
})
export class HistorySidebarService {
  _appliedFiltersAmountSubject = new BehaviorSubject<number>(0);
  appliedFiltersAmountSubject =
    this._appliedFiltersAmountSubject.asObservable();
  private initialHistoryTableColumnConfig: HistoryTableColumns[] = [
    {
      field: "id",
      header: "ID",
      visible: false,
      sortable: false,
    },
    {
      field: "historyDescription",
      header: "DESCRIPTION",
      visible: true,
      sortable: true,
    },
    {
      field: "deck",
      header: "DECK",
      visible: true,
      sortable: false,
    },
    {
      field: "frame",
      header: "FRAME",
      visible: true,
      sortable: false,
    },
    {
      field: "mvz",
      header: "MVZ",
      visible: false,
      sortable: false,
    },

    {
      field: "assetsInvolved",
      header: "ASSETS",
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
      field: "severity",
      header: "ALERT LEVEL",
      visible: true,
      sortable: true,
    },
    {
      field: "createdAt",
      header: "DATE",
      visible: true,
      sortable: true,
    },
    { field: "linkToIncidentOV", header: "", visible: true, sortable: false },
  ];

  private visibleColumnsHistorySubject = new BehaviorSubject<
    HistoryTableColumns[]
  >(this.initialHistoryTableColumnConfig);
  visibleColumns$ = this.visibleColumnsHistorySubject.asObservable();

  private resetSubject = new BehaviorSubject<boolean>(false);
  resetTriggered = this.resetSubject.asObservable();

  private filtersSubject = new BehaviorSubject<any>({});
  currentFilters = this.filtersSubject.asObservable();

  private _closedIncidentsListSubject = new BehaviorSubject<Incident[]>([]);
  closedIncidentsListSubject = this._closedIncidentsListSubject.asObservable();

  updateVisibleColumns(selectedColumns: HistoryTableColumns[]) {
    let newHistoryTBColumnsConfig: HistoryTableColumns[] = [
      ...this.initialHistoryTableColumnConfig,
    ];

    const recalculatedConfig = newHistoryTBColumnsConfig.map(
      (historyTBColumnConfig) => {
        let calculatedHistoryTBColumnConfig: HistoryTableColumns;
        if (
          selectedColumns.some(
            (selectedColum) =>
              selectedColum.field === historyTBColumnConfig.field
          )
        ) {
          calculatedHistoryTBColumnConfig = {
            ...historyTBColumnConfig,
            visible: true,
          };
        } else {
          calculatedHistoryTBColumnConfig = {
            ...historyTBColumnConfig,
            visible: false,
          };
        }

        return calculatedHistoryTBColumnConfig;
      }
    );

    newHistoryTBColumnsConfig = [...recalculatedConfig];

    this.visibleColumnsHistorySubject.next(newHistoryTBColumnsConfig);
  }

  updateIncidentList(newIncidentList: any) {
    this._closedIncidentsListSubject.next(newIncidentList);
  }

  resetVisibleColumnsInitialConfig() {
    this.visibleColumnsHistorySubject.next(
      this.initialHistoryTableColumnConfig
    );
  }

  getInitialColumnsConfig(): HistoryTableColumns[] {
    return this.initialHistoryTableColumnConfig;
  }

  updateAppliedFiltersCount(currentActiveFiltersCount: number) {
    this._appliedFiltersAmountSubject.next(currentActiveFiltersCount);
  }

  resetFiltersCount(): void {
    this._appliedFiltersAmountSubject.next(0);
  }

  updateFilters(newFilters: any) {
    this.filtersSubject.next(newFilters);
  }

  triggerReset() {
    this.resetSubject.next(true);
  }

  getIncidentsDescriptionOptions(): Observable<string[]> {
    return this.closedIncidentsListSubject.pipe(
      map((incidents) => {
        if (!Array.isArray(incidents)) return [];
        return incidents.filter(incident => incident?.status.toLowerCase()!=='new')
          .map((incident) => incident?.description) // Estrai le descrizioni
          .filter((desc): desc is string => !!desc) // Filtra valori null/undefined
          .filter((desc, index, array) => array.indexOf(desc) === index); // Rimuovi duplicati
      })
    );
  }

  getIncidentsAlertsLevelOptions(): Observable<any> {
    return this.closedIncidentsListSubject.pipe(
      map((incidents) => incidents.map((incident) => incident?.severity))
    );
  }

  getIncidentsDeckOptions(): Observable<string[]> {
    return this.closedIncidentsListSubject.pipe(
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
    return this.closedIncidentsListSubject.pipe(
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
    return this.closedIncidentsListSubject.pipe(
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
