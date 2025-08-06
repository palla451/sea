import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { Table, TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { PaginatorModule } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import {
  IncidentOVTableColumns,
  SidebarService,
} from "../../../services/dashboard-sidebar.service";
import { filter, noop, Subject, Subscription, switchMap, takeUntil, tap } from "rxjs";
import { HoverService } from "../../../services/hover.service";
import { Incident } from "../../../models/dashboard.models";
import { Router } from "@angular/router";
import { ColumnSettingsSidebarComponent } from "../../../../../core/components/column-settings-sidebar/column-settings-sidebar.component";
import { TableFiltersSidebarComponent } from "../../../../../core/components/table-filters-sidebar/table-filters-sidebar.component";
import { Store } from "@ngrx/store";
import {
  calculateOperatingPercentageActions,
  incidentDetailActions,
  shipFunctionsByAssetActions,
} from "../../../../../core/state/actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationTargetEnum } from "../../../../../core/enums/navigation-targets.enum";
import { LocalSpinnerComponent } from "../../../../../core/components/local-spinner/local-spinner.component";
import { DashboardService } from "../../../services/dashboard.service";
import { IncidentManageButtonComponent } from "../../../../../core/components/incident-manage-button/incident-manage-button.component";
import { BaseReadonlyModalComponent } from "../../../../../core/components/base-readonly-modal/base-readonly-modal.component";
import { IncidentManagementModalComponent } from "../../../../../core/components/incident-management-modal/incident-management-modal.component";
import {
  IncidentDetail,
  IncidentEvent,
} from "../../../../incident-detail/models/incident-detail.models";
import { fromDashboardCore, fromIncidentDetail, selectEvents } from "../../../../../core/state";
import { hasPrivilegedAccess } from "../../../../../auth/state";
import { IncidentManagementManagerService } from "../../../../../core/services/incident-management-manager.service";
import { SharedModule } from "../../../../../shared/shared.module";
import { isNonNull } from "../../../../../core/utils/rxjs-operators/noNullOperator";

@Component({
  selector: "app-incident-overview-table",
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
    LocalSpinnerComponent,
    IncidentManageButtonComponent,
    BaseReadonlyModalComponent,
    IncidentManagementModalComponent,
    SharedModule,
  ],
  templateUrl: "./incident-overview-table.component.html",
  styleUrl: "./incident-overview-table.component.scss",
})
export class IncidentOverviewTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );
  private readonly store = inject(Store);
  private originalIncidents: Incident[] = [];
  private filterSubscription!: Subscription;
  private resetSubscription!: Subscription;
  @ViewChild("incidentOVtable") incidentOVtable!: Table;
  private _incidents: readonly Incident[] | null = null;
  hasPrivilegedAccess$ = this.store.select(hasPrivilegedAccess);
  incidentsSignal = signal<Incident[] | null>(null);
  isTableDataLoading = true;

  rows = signal<number>(0);
  first = signal<number>(0);
  shouldShowPaginator = computed<boolean>(() => {
    if (this._incidents) {
      return this._incidents.length > this.rows();
    } else {
      return false;
    }
  });

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  incidentEvents = computed<IncidentEvent[]>(() => {
    let returningIncidentEvents;
    if (this.allIncidents()) {
      const currentlySelectedIncident = this.allIncidents()[0];
      returningIncidentEvents = currentlySelectedIncident?.events;
    }

    return returningIncidentEvents ?? [];
  });

  @Input() set incidents(value: Incident[] | null) {
    this._incidents = value;
    if (value) {
      const newIncidents = value.filter(
        (incident) => incident?.status.toLowerCase() === "new"
      );

      this.incidentsSignal.set([...newIncidents]);
    } else {
      this.incidentsSignal.set(null);
    }

    this.first.set(0);
  }

  @Input() set rowsPerPage(pageRow: number) {
    this.rows.set(pageRow);
    this.first.set(0);
  }

  get incidents(): readonly Incident[] | null {
    return this._incidents;
  }

  @Input() isInIncidentsPage?: boolean;

  // Computed signal per gli incidenti paginati
  paginatedIncidents = computed<Incident[]>(() => {
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return (this._incidents ?? []).slice(startIndex, endIndex);
  });

  sidebarService = inject(SidebarService);
  private hoverService = inject(HoverService);

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

  activeSidebarFiltersCount = toSignal(
    this.sidebarService.appliedFiltersAmountSubject,
    {
      initialValue: 0,
    }
  );

  // activeSidebarFiltersCount$!: Observable<number>;

  dashboardService = inject(DashboardService);
  currentIncidentId = signal<number>(-1);

  selectedIncident: IncidentEvent[] | null = null;
  isIncidentModalOpened: boolean = false;

  events = toSignal(this.store.select(selectEvents), {
    initialValue: [],
  });

  constructor(private router: Router) {
    effect(() => {
      this.selectedIncident = this.events();
      if (this.currentIncidentId() !== -1 && this.events().length) {
        this.isIncidentModalOpened = true;
      }
    });
  }

  ngOnInit() {
    this.store.select(fromDashboardCore.selectAllIncidentsList).pipe(
          takeUntil(this.onDestroy$),
          filter(isNonNull),
          tap(incidentList => {
            this.originalIncidents = [...(incidentList ?? [])];
            this.isTableDataLoading = false;
          }),
          switchMap(_ => this.sidebarService.currentFilters.pipe(
            tap(filters => {
              this.applyFilters(filters);
            })
          ))
        ).subscribe(noop);

    

    // Sottoscrizione ai filtri
    // this.filterSubscription = this.sidebarService.currentFilters.subscribe(
    //   (filters) => {
    //     this.applyFilters(filters);
    //   }
    // );

    // Sottoscrizione al reset
    this.resetSubscription = this.sidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );
  }

  ngOnDestroy() {
    //this.filterSubscription.unsubscribe();
    this.resetSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
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

    // Filtra per date
    if (filters?.dates?.start || filters.dates?.end) {
      
      filteredData = filteredData.filter((incident) => {
        //TODO - OGGI - RIMETTERE A POSTO ANCHE IL DISCORSO DELLE DATE E RELATIVO FILTRO

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

  /**
   * Metodo chiamato quando cambia la pagina
   * @param event
   */
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

  checkIfColumnIsVisible(
    columns: IncidentOVTableColumns[],
    key: string
  ): boolean {
    return !!columns.find((el) => el.field === key)?.visible;
  }

  onRowHover(row: any) {
    this.hoverService.setHoveredRow(row);
  }

  onRowLeave() {
    this.hoverService.clearHoveredRow();
  }

  getPageNumbers(state: any): number[] {
    const pageCount = Math.ceil(state.totalRecords / state.rows);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isActivePage(state: any, page: number): boolean {
    return state.first === (page - 1) * state.rows;
  }

  onIncidentManageClick(incident: IncidentDetail) {
    if (incident?.id !== -1) {
      this.store
        .select(fromIncidentDetail.selectIncidentDetailBundle)
        .pipe(
          tap((newSelectedIncident) => {
            if (newSelectedIncident && newSelectedIncident.length) {
              const firstIncidentEventDescription =
                newSelectedIncident[0]?.events[0]?.description;
              const firstIncidentRemediationId =
                newSelectedIncident[0]?.events[0]?.remediation?.id;
              const currentlyInvolvedAssetIpAddress =
                newSelectedIncident[0]?.events[0]?.remediation?.actions[0]
                  ?.asset?.ipAddress;
              const currentlyInvolvedAssetHostname =
                newSelectedIncident[0]?.events[0]?.remediation?.actions[0]
                  ?.asset?.hostName;

              this.incidentManagementManagerService.updateCurrentStepperEventSelected(
                firstIncidentEventDescription
              );
              if (firstIncidentRemediationId !== -1) {
                this.store.dispatch(
                  shipFunctionsByAssetActions.getAllShipFunctionsByAsset({
                    remediationId: firstIncidentRemediationId,
                  })
                );
              }

              this.store.dispatch(
                calculateOperatingPercentageActions.getFunctionOperatingPercentage(
                  {
                    assetIP: currentlyInvolvedAssetIpAddress ?? "",
                    hostName: currentlyInvolvedAssetHostname ?? "",
                  }
                )
              );
            }
          })
        )
        .subscribe(noop);
    }

    this.store.dispatch(
      incidentDetailActions.getAllIncidentDetail({ incidentId: incident?.id })
    );
  }

  onIncidentClick(incident: IncidentDetail) {
    if (this.isInIncidentsPage) {
      this.sidebarService.updateIncidentDetailInitiator(
        NavigationTargetEnum.open_incidents_page
      );
    } else {
      this.sidebarService.updateIncidentDetailInitiator(
        NavigationTargetEnum.dashboard_page
      );
    }

    this.onIncidentManageClick(incident);
    this.router.navigate(["/incident-detail", incident?.id]);
  }

  capitalizeFirstLetter(input: string): string {
    if (!input) return "";
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  manageModalClosedState() {
    this.isIncidentModalOpened = false;
    this.selectedIncident = null;
  }

  incidentSelected(selectedIncident: Incident): void {
    this.currentIncidentId.set(selectedIncident.id);
  }
}
