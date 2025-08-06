import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { MenuModule } from "primeng/menu";
import { PaginatorModule } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { Table, TableModule } from "primeng/table";
import { ColumnSettingsSidebarComponent } from "../../../../core/components/column-settings-sidebar/column-settings-sidebar.component";
import { TableFiltersSidebarComponent } from "../../../../core/components/table-filters-sidebar/table-filters-sidebar.component";
import { MenuItem } from "primeng/api";
import { Observable, Subscription } from "rxjs";
import {
  HistorySidebarService,
  HistoryTableColumns,
} from "../../services/history-sidebar.service";
import { Asset } from "../../../../core/models/asset.model";
import { IncidentDetail } from "../../../incident-detail/models/incident-detail.models";
import { Incident } from "../../../dashboard/models/dashboard.models";
import { Store } from "@ngrx/store";
import { HoverService } from "../../../dashboard/services/hover.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { incidentDetailActions } from "../../../../core/state/actions";
import { SidebarService } from "../../../dashboard/services/dashboard-sidebar.service";
import { NavigationTargetEnum } from "../../../../core/enums/navigation-targets.enum";
import { SharedModule } from "../../../../shared/shared.module";

@Component({
  selector: "app-history-table",
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    MenuModule,
    PaginatorModule,
    SelectModule,
    ButtonModule,
    ColumnSettingsSidebarComponent,
    TableFiltersSidebarComponent,
    SharedModule,
  ],
  templateUrl: "./history-table.component.html",
  styleUrl: "./history-table.component.scss",
})
export class HistoryTableComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private originalIncidents: Incident[] = [];
  private filterSubscription!: Subscription;
  private resetSubscription!: Subscription;
  @ViewChild("incidentHistorytable") incidentHistorytable!: Table;
  private _incidents: readonly Incident[] = [];

  // Signal mutabile per PrimeNG
  incidentsSignal = signal<Incident[]>([]);

  rows = signal<number>(0);
  first = signal<number>(0);
  shouldShowPaginator = computed<boolean>(
    () => this._incidents.length > this.rows()
  );

  @Input() set incidents(value: readonly Incident[]) {
    this._incidents = value;
    this.incidentsSignal.set([...value]);
    this.first.set(0);
  }

  @Input() set rowsPerPage(pageRow: number) {
    this.rows.set(pageRow);
    this.first.set(0);
  }

  get incidents(): readonly Incident[] {
    return this._incidents;
  }

  // Computed signal per gli incidenti paginati
  paginatedIncidents = computed<Incident[]>(() => {
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return this._incidents.slice(startIndex, endIndex);
  });

  sidebarService = inject(HistorySidebarService);
  dashboardSidebarService = inject(SidebarService);

  selectedColumns = toSignal(this.sidebarService.visibleColumns$, {
    initialValue: [],
  });

  showSettingsSidebar = false;
  showFiltersSidebar = false;

  alertSeverityColors: {
    [key: string]: "danger" | "medium" | "low";
  } = {
    Critical: "danger",
    High: "danger",
    Medium: "medium",
    Low: "low",
  };

  activeSidebarFiltersCount$!: Observable<number>;

  constructor(private router: Router) {
    this.activeSidebarFiltersCount$ =
      this.sidebarService.appliedFiltersAmountSubject;
  }

  ngOnInit() {
    this.originalIncidents = [...this._incidents];
    // Sottoscrizione ai filtri
    this.filterSubscription = this.sidebarService.currentFilters.subscribe(
      (filters) => {
        this.applyFilters(filters);
      }
    );

    // Sottoscrizione al reset
    this.resetSubscription = this.sidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.resetSubscription.unsubscribe();
  }

  private convertTableIncideStatusValues(tableValue: string): string {
    let backValue = "";

    switch (tableValue) {
      case "SOLVED":
        backValue = "Closed";
        break;

      case "FALSEPOSITIVE":
        backValue = "False positive";
        break;
    }

    return backValue;
  }

  private applyFilters(filters: any) {
    if (!filters || Object.keys(filters).length === 0) {
      this.incidentsSignal.set([...this.originalIncidents]);
      return;
    }

    let filteredData = [...this.originalIncidents];

    // Filtra per livelli di alert
    if (filters?.levels && (filters?.levels as string[])?.length) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.levels as string[]).some(
          (alertLevel) =>
            alertLevel.toUpperCase() === incident?.severity.toUpperCase()
        );
      });
    }

    // Filtra per incident status

    if (
      filters?.incidentStatuses &&
      (filters?.incidentStatuses as string[])?.length
    ) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.incidentStatuses as string[]).some(
          (incidentStatus) =>
            this.convertTableIncideStatusValues(incidentStatus) ===
            incident?.status.trim()
        );
      });
    }

    // Filtra per date
    if (filters?.dates?.start || filters.dates?.end) {
      filteredData = filteredData.filter((incident) => {
        const startValid =
          !filters.dates.start ||
          (incident.createdAt as Date).getTime() >=
            new Date(filters.dates.start).getTime();
        const endValid =
          !filters.dates.end ||
          (incident.createdAt as Date).getTime() <=
            new Date(filters.dates.end).getTime();
        return startValid && endValid;
      });
    }

    // Filtra per multiselect descrizioni
    if (
      filters?.descriptionsSelections &&
      (filters?.descriptionsSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.descriptionsSelections as string[])?.some(
          (descriptionsSelection) => {
            return descriptionsSelection === incident?.description;
          }
        );
      });
    }

    // Filtra per multiselect deck
    if (
      filters?.decksSelections &&
      (filters?.decksSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.decksSelections as string[])?.every(
          (decksSelection) => {
            return incident?.decks.some(
              (deck) => String(deck) === decksSelection
            );
          }
        );
      });
    }

    // Filtra per multiselect frame
    if (
      filters?.framesSelections &&
      (filters?.framesSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.framesSelections as string[])?.every(
          (framesSelection) => {
            return incident?.frames.some(
              (frame) => String(frame) === framesSelection
            );
          }
        );
      });
    }

    // Filtra per multiselect mvz
    if (
      filters?.mvzSelections &&
      (filters?.mvzSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((incident) => {
        return (filters?.mvzSelections as string[])?.some((mvzSelection) => {
          return mvzSelection === String(incident?.mvz);
        });
      });
    }

    this.incidentsSignal.set(filteredData);
    this.first.set(0); // Resetta alla prima pagina
  }

  private isValidIncidentKey(key: string): key is keyof Incident {
    const validKeys: (keyof Incident)[] = [
      "id",
      "description",
      "decks",
      "frames",
      "status",
      "mvz",
      "assetsInvolved",
      "severity",
      "createdAt",
      "status",
      // Aggiungi tutte le proprietà valide dell'interfaccia Incident
    ];
    return validKeys.includes(key as keyof Incident);
  }

  private resetFilters() {
    this.incidentsSignal.set([...this.originalIncidents]);
    this.first.set(0); // Resetta alla prima pagina

    // // Se stai usando PrimeNG Table, potresti aver bisogno di:
    // if (this.incidentOVtable) {
    // this.incidentOVtable.reset(); // Resetta lo stato della tabella (ordinamento, ecc.)
    // }
  }

  // Metodo chiamato quando cambia la pagina
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  getAlertSeverityColor(alertLevel: string): string {
    let returningLevel = "";

    switch (alertLevel) {
      case "High":
      case "Critical":
        returningLevel = "#F64D4D";
        break;
      case "Medium":
        returningLevel = "#FF8826";
        break;
      case "Low":
        returningLevel = "#FFCF26";
        break;
    }

    return returningLevel;
  }

  getAlertSeverityShadow(alertLevel: string): string {
    let returningShadow = "";

    switch (alertLevel) {
      case "High":
      case "Critical":
        returningShadow = "0 0 0 2px rgba(246, 77, 77, 0.2)";
        break;
      case "Medium":
        returningShadow = "0 0 0 2px rgba(255, 136, 38, 0.2)";
        break;
      case "Low":
        returningShadow = "0 0 0 2px rgba(255, 207, 38, 0.2)";
        break;
    }

    return returningShadow;
  }

  getFormattedList(arrayToSplit: number[]): string {
    return arrayToSplit?.join(" · ").toString();
  }

  menuItems: MenuItem[] = [
    { label: "Filter by Date", icon: "pi pi-calendar" },
    { label: "Filter by Severity", icon: "pi pi-filter" },
  ];

  // Metodo per aggiornare lo stato del paginatore
  // updatePaginatorState() {
  // //la prossima istruzione commentata rende il paginatore dinamicamente visibile sulla base dell opzione righe per pagina scelta
  // //this.shouldShowPaginator = this.incidents.length > this.rows;

  // //la prossima istruzione commentata rende il paginatore sempre visibile a fronte della presenza del selettore di righe per pagina
  // this.shouldShowPaginator = this.incidents?.length > 0;
  // }

  // Metodo per simulare il caricamento dei dati
  loadData() {
    // Simula il caricamento dei dati
    this.incidents = [
      // ... dati della tabella
    ];
  }

  toggleFilters(): void {
    this.showFiltersSidebar = true;
  }

  toggleSettings() {
    this.showSettingsSidebar = true;
  }

  // onColumnSettingsConfirm(updatedColumns: any[]) {
  // this.columns = updatedColumns;
  // // Qui puoi aggiungere logica aggiuntiva se necessario
  // }

  onColumnSettingsReset() {
    // La reset viene gestita automaticamente dal componente sidebar
  }

  onSettingsSidebarClosing(): void {
    this.showSettingsSidebar = false;
  }

  onFiltersSidebarClosing(): void {
    this.showFiltersSidebar = false;
  }

  checkIfColumnIsVisible(columns: HistoryTableColumns[], key: string): boolean {
    return !!columns.find((el) => el.field === key)?.visible;
  }

  getPageNumbers(state: any): number[] {
    const pageCount = Math.ceil(state.totalRecords / state.rows);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isActivePage(state: any, page: number): boolean {
    return state.first === (page - 1) * state.rows;
  }

  onIncidentClick(incident: string) {
    this.store.dispatch(
      incidentDetailActions.getAllIncidentDetail({ incidentId: incident })
    );
    this.dashboardSidebarService.updateIncidentDetailInitiator(
      NavigationTargetEnum.history
    );
    this.router.navigate(["/incident-detail", incident]);
  }

  mapClosedStatusLabel(incidentStatus: string): string {
    return incidentStatus.toLowerCase() === "closed"
      ? "Solved"
      : incidentStatus;
  }
}
