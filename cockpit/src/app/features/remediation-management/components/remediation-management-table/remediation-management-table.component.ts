import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { ColumnSettingsSidebarComponent } from "../../../../core/components/column-settings-sidebar/column-settings-sidebar.component";
import { TableFiltersSidebarComponent } from "../../../../core/components/table-filters-sidebar/table-filters-sidebar.component";
import { Observable, Subscription } from "rxjs";
import {
  RemediationItem,
  RemediationManagementTableColumns,
} from "../../models/remediation-management.models";
import { RemediationSidebarService } from "../../services/remediation-sidebar.service";
import { SharedModule } from "../../../../shared/shared.module";
import { Table, TableModule } from "primeng/table";
import { CustomContextMenuComponent } from "../../../../core/components/custom-context-menu/custom-context-menu.component";
import { Store } from "@ngrx/store";
import { incidentDetailActions } from "../../../../core/state/actions";
import { NavigationTargetEnum } from "../../../../core/enums/navigation-targets.enum";
import { SidebarService } from "../../../dashboard/services/dashboard-sidebar.service";
import { Router } from "@angular/router";
import { RollbackModalComponent } from "../rollback-modal/rollback-modal.component";
import { hasPrivilegedAccess } from "../../../../auth/state";
import { incidentRemediationsActions } from "../../state/actions";
@Component({
  selector: "app-remediation-management-table",
  imports: [
    SharedModule,
    ColumnSettingsSidebarComponent, 
    TableFiltersSidebarComponent,
    TableModule,
    ColumnSettingsSidebarComponent,
    TableFiltersSidebarComponent,
    CustomContextMenuComponent,
    RollbackModalComponent,
  ],
  templateUrl: "./remediation-management-table.component.html",
  styleUrl: "./remediation-management-table.component.scss",
})
export class RemediationManagementTableComponent implements OnInit {
  activeMenuId: string | null = null;
  private readonly store = inject(Store);
  dashboardSidebarService = inject(SidebarService);
  router = inject(Router);

  hasPrivilegedAccess$ = this.store.select(hasPrivilegedAccess);

  sidebarService = inject(RemediationSidebarService);
  private filterSubscription!: Subscription;
  private resetSubscription!: Subscription;
  @ViewChild("remediationMNGMTtable") remediationMNGMTtable!: Table;
  showSettingsSidebar = false;
  showFiltersSidebar = false;

  selectedColumns$!: Observable<RemediationManagementTableColumns[]>;
  selectedColumns: RemediationManagementTableColumns[] = [];

  showRollbackModal = signal(false);
  rollbackActionId = signal<string>("");

  activeSidebarFiltersCount$!: Observable<number>;

  private originalRemediations: RemediationItem[] = [];
  private _remediations = signal<RemediationItem[]>([]);

  @Input() set remediations(value: RemediationItem[]) {
    this._remediations.set(value || []);
    this.first.set(0); // Resetta alla prima pagina quando cambiano i dati
  }
  get remediations() {
    return this._remediations();
  }

  // Signals per la paginazione
  rows = signal<number>(12);
  first = signal<number>(0);
  shouldShowPaginator = computed<boolean>(
    () => this._remediations().length > this.rows()
  );

  // Computed signal per gli assets paginati
  paginatedAssets = computed<RemediationItem[]>(() => {
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return this._remediations().slice(startIndex, endIndex);
  });

  constructor() {
    this.selectedColumns$ = this.sidebarService.visibleColumns$;
    this.activeSidebarFiltersCount$ =
      this.sidebarService.appliedFiltersAmountSubject;
  }

  ngOnInit(): void {
    this.originalRemediations = [...this._remediations()];

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

  checkIfActionIsRollbackable(remediation: RemediationItem): boolean {
    return (
      remediation.status.toLowerCase() === "completed" &&
      remediation.rollbackable
    );
  }

  navigateToIncidentDetail(remediation: RemediationItem): void {
    this.store.dispatch(
      incidentDetailActions.getAllIncidentDetail({
        incidentId: String(remediation.incidentId),
      })
    );
    this.dashboardSidebarService.updateIncidentDetailInitiator(
      NavigationTargetEnum.remediations
    );
    this.router.navigate(["/incident-detail", String(remediation.incidentId)]);
  }

  openContextualMenu(remediationClicked: RemediationItem) {
    this.activeMenuId =
      String(remediationClicked.incidentId) +
      String(remediationClicked.actionId);
  }

  checkActiveMenuId(remediationClicked: RemediationItem): boolean {
    return (
      this.activeMenuId ===
      String(remediationClicked.incidentId) +
        String(remediationClicked.actionId)
    );
  }

  private applyFilters(filters: any) {
    if (!filters || Object.keys(filters).length === 0) {
      this._remediations.set([...this.originalRemediations]);
      return;
    }

    let filteredData = [...this.originalRemediations];

    
    // Filtra per remediation types
    if (filters?.remediationActionTypes && (filters?.remediationActionTypes as string[])?.length) {
      filteredData = filteredData.filter((remediation) => {
        return (filters?.remediationActionTypes as string[]).some(
          (remediationActionType) =>
            remediationActionType.toUpperCase() === remediation?.actionType.toUpperCase()
        );
      });
    }

    // Filtra per remediation status
    if (filters?.remediationActionStatuses && (filters?.remediationActionStatuses as string[])?.length) {
      filteredData = filteredData.filter((remediation) => {
        return (filters?.remediationActionStatuses as string[]).some(
          (remediationActionStatus) =>
            remediationActionStatus.toUpperCase() === remediation?.status.toUpperCase()
        );
      });
    }

    // // Filtra per incidentId
    // if (filters?.incidentId && (filters?.incidentId as string[])?.length) {
    //   filteredData = filteredData.filter((remediation) => {
    //     return (filters?.incidentId as string[]).some(
    //       (status) => status === remediation?.status.toUpperCase()
    //     );
    //   });
    // }

    // Filtra per remediation incident description
    if (
      filters?.remediationsIncidentDescriptions &&
      (filters?.remediationsIncidentDescriptions as string[])?.length
    ) {
      filteredData = filteredData.filter((remediation) => {
        return (filters?.remediationsIncidentDescriptions as string[])?.some(
          (remediationsIncidentDescription) => {
            return (
              remediationsIncidentDescription ===
              remediation?.incidentDescription
            );
          }
        );
      });
    }

    // Filtra per remediation action description
    if (
      filters?.remediationsActionDescriptions &&
      (filters?.remediationsActionDescriptions as string[])?.length
    ) {
      filteredData = filteredData.filter((remediation) => {
        return (filters?.remediationsActionDescriptions as string[])?.some(
          (remediationsActionDescription) => {
            return remediationsActionDescription === remediation?.description;
          }
        );
      });
    }

    // // Filtra per multiselect description
    // if (
    //   filters?.typeSelections &&
    //   (filters?.typeSelections as string[])?.length
    // ) {
    //   filteredData = filteredData.filter((asset) => {
    //     return (filters?.typeSelections as string[])?.some((typeSelection) => {
    //       return typeSelection === asset?.type;
    //     });
    //   });
    // }

    // // Filtra per multiselect name
    // if (
    //   filters?.nameSelections &&
    //   (filters?.nameSelections as string[])?.length
    // ) {
    //   filteredData = filteredData.filter((asset) => {
    //     return (filters?.nameSelections as string[])?.some((nameSelection) => {
    //       return nameSelection === asset?.name;
    //     });
    //   });
    // }

    this._remediations.set(filteredData);
    this.first.set(0); // Resetta alla prima pagina
  }

  private resetFilters() {
    this._remediations.set([...this.originalRemediations]);
    this.first.set(0); // Resetta alla prima pagina
  }

  onFiltersSidebarClosing(): void {
    this.showFiltersSidebar = false;
  }

  onSettingsSidebarClosing(): void {
    this.showSettingsSidebar = false;
  }

  toggleSettings() {
    this.showSettingsSidebar = true;
  }

  toggleFilters(): void {
    this.showFiltersSidebar = true;
  }
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  checkIfColumnIsVisible(
    columns: RemediationManagementTableColumns[],
    key: string
  ): boolean {
    return !!columns.find((el) => el.field === key)?.visible;
  }

  //Rollback modal
  openRollbackModal(incidentId: string) {
    this.rollbackActionId.set(incidentId);
    this.showRollbackModal.set(true);
  }

  closeRollbackModal() {
    this.showRollbackModal.set(false);
    this.rollbackActionId.set("");
  }

  confirmRollback() {
    this.store.dispatch(incidentRemediationsActions.rollbackAction({
      actionId: this.sidebarService._lastRollbackedActionId?.value
    }));
    
    this.closeRollbackModal();
  }
}
