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
import { Table, TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { PaginatorModule } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { noop, Observable, Subscription, tap } from "rxjs";
import { IncidentOVTableColumns } from "../../../dashboard/services/dashboard-sidebar.service";
import { TableModalService } from "../../services/table-modal.service";
import { AssetSidebarService } from "../../services/asset-sidebar.service";
import { ColumnSettingsSidebarComponent } from "../../../../core/components/column-settings-sidebar/column-settings-sidebar.component";
import { TableFiltersSidebarComponent } from "../../../../core/components/table-filters-sidebar/table-filters-sidebar.component";
import { Asset } from "../../../../core/models/asset.model";
import { Store } from "@ngrx/store";
import { hasPrivilegedAccess } from "../../../../auth/state";
import { SharedModule } from "../../../../shared/shared.module";

@Component({
  selector: "app-asset-table",
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
  templateUrl: "./asset-table.component.html",
  styleUrl: "./asset-table.component.scss",
})
export class AssetTableComponent implements OnInit, OnDestroy {
  @ViewChild("assetsMNGMTtable") assetsMNGMTtable!: Table;
  private filterSubscription!: Subscription;
  private resetSubscription!: Subscription;

  _assets = signal<Asset[]>([]);

  @Input() set assets(value: Asset[]) {
    this._assets.set([...value]);
    this.first.set(0);
  }
  get assets() {
    return this._assets();
  }

  rows = signal<number>(12);
  first = signal<number>(0);
  shouldShowPaginator = computed<boolean>(
    () => this._assets().length > this.rows()
  );

  paginatedAssets = computed<Asset[]>(() => {
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return this._assets().slice(startIndex, endIndex);
  });

  sidebarService = inject(AssetSidebarService);
  selectedColumns$!: Observable<IncidentOVTableColumns[]>;
  selectedColumns: IncidentOVTableColumns[] = [];

  showSettingsSidebar = false;
  showFiltersSidebar = false;
  showAssetModal = false;

  activeSidebarFiltersCount$!: Observable<number>;
  activeSidebarFiltersCountSignal = signal<number>(0);

  originalAssets: Asset[] = [];

  private store = inject(Store);
  hasPrivilegedAccess$ = this.store.select(hasPrivilegedAccess);

  constructor(private tableModalService: TableModalService) {
    this.selectedColumns$ = this.sidebarService.visibleColumns$;
    this.activeSidebarFiltersCount$ =
      this.sidebarService.appliedFiltersAmountSubject;
  }

  ngOnInit() {
    this.activeSidebarFiltersCount$
      .pipe(
        tap((activeSidebarFiltersCount) => {
          this.activeSidebarFiltersCountSignal.set(activeSidebarFiltersCount);
        })
      )
      .subscribe(noop);
    this.originalAssets = [...this._assets()];

    /**
     * Sottoscrizione ai filtri
     */
    this.filterSubscription = this.sidebarService.currentFilters.subscribe(
      (filters) => {
        this.applyFilters(filters);
      }
    );

    /**
     * Sottoscrizione al reset
     */
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

  private applyFilters(filters: any) {
    if (!filters || Object.keys(filters).length === 0) {
      this._assets.set([...this.originalAssets]);
      this.first.set(0);
      if (this.assetsMNGMTtable) {
        this.assetsMNGMTtable.first = 0;
      }
      return;
    }

    let filteredData = [...this.originalAssets];

    // Filtra per asset status
    if (filters?.assetsStatus && (filters?.assetsStatus as string[])?.length) {
      filteredData = filteredData.filter((asset) => {
        return (filters?.assetsStatus as string[]).some(
          (status) =>
            status.toUpperCase() ===
            asset?.status.toUpperCase().replace(/\s+/g, "")
        );
      });
    }

    // Filtra per multiselect mark pieces
    if (
      filters?.markPiecesSelections &&
      (filters?.markPiecesSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((asset) => {
        return (filters?.markPiecesSelections as string[])?.some(
          (markPiecesSelection) => {
            return markPiecesSelection === asset?.pieceMark;
          }
        );
      });
    }

    // Filtra per multiselect description
    if (
      filters?.typeSelections &&
      (filters?.typeSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((asset) => {
        return (filters?.typeSelections as string[])?.some((typeSelection) => {
          return typeSelection === asset?.systemInfo;
        });
      });
    }

    // Filtra per multiselect name
    if (
      filters?.nameSelections &&
      (filters?.nameSelections as string[])?.length
    ) {
      filteredData = filteredData.filter((asset) => {
        return (filters?.nameSelections as string[])?.some((nameSelection) => {
          return nameSelection === asset?.name;
        });
      });
    }

    if (this.activeSidebarFiltersCountSignal() > 0) {
      this._assets.set(filteredData);
      this.first.set(0);
      // Forza il reset della pagina nella tabella PrimeNG
      if (this.assetsMNGMTtable) {
        this.assetsMNGMTtable.first = 0;
        this.assetsMNGMTtable.reset();
      }
    }
  }

  private resetFilters() {
    this._assets.set([...this.originalAssets]);
    this.first.set(0); // Resetta alla prima pagina
  }

  toggleFilters(): void {
    this.showFiltersSidebar = true;
  }

  onFiltersSidebarClosing(): void {
    this.showFiltersSidebar = false;
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  getFormattedList(arrayToSplit: number[]): string {
    return arrayToSplit?.join(" · ").toString();
  }

  menuItems: MenuItem[] = [
    { label: "Filter by Date", icon: "pi pi-calendar" },
    { label: "Filter by Severity", icon: "pi pi-filter" },
  ];

  handleSecondaryClick(): void {}

  toggleSettings() {
    this.showSettingsSidebar = true;
  }

  onSidebarClosing(): void {
    this.showSettingsSidebar = false;
  }

  checkIfColumnIsVisible(
    columns: IncidentOVTableColumns[],
    key: string
  ): boolean {
    return !!columns.find((el) => el.field === key)?.visible;
  }

  getPageNumbers(state: any): number[] {
    const pageCount = Math.ceil(state.totalRecords / state.rows);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isActivePage(state: any, page: number): boolean {
    return state.first === (page - 1) * state.rows;
  }

  openAssetModal(asset: Asset) {
    this.tableModalService.openModal(asset);
  }

  getAlertSeverityColor(alertLevel: string): string {
    let returningLevel = "";

    switch (alertLevel) {
      case "Compromised":
        returningLevel = "#F64D4D";
        break;
      case "Maintenance":
        returningLevel = "#FFCF26";
        break;
      case "Turned Off":
        returningLevel = "#666666";
        break;
      case "Operational":
        returningLevel = "#67CA00";
    }

    return returningLevel;
  }

  getAlertSeverityShadow(alertLevel: string): string {
    let returningShadow = "";

    switch (alertLevel) {
      case "Compromised":
        returningShadow = "0 0 0 2px rgba(246, 77, 77, 0.2)";
        break;
      case "Maintenance":
        returningShadow = "0 0 0 2px rgba(255, 207, 38, 0.2)";
        break;
      case "Turned Off":
        returningShadow = "0 0 0 2px rgba(102, 102, 102, 0.2)";
        break;
      case "Operational":
        returningShadow = "0 0 0 2px rgba(103, 202, 0, 0.2)";
    }

    return returningShadow;
  }
}
