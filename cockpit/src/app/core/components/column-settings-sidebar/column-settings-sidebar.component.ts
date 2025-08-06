import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { filter, map, noop, Subject, takeUntil, tap } from "rxjs";
import {
  IncidentOVTableColumns,
  SidebarService,
} from "../../../features/dashboard/services/dashboard-sidebar.service";
import { isNonNull } from "../../utils/rxjs-operators/noNullOperator";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AssetSidebarService,
  AssetsTableColumns,
} from "../../../features/asset-management/services/asset-sidebar.service";
import {
  HistorySidebarService,
  HistoryTableColumns,
} from "../../../features/history/services/history-sidebar.service";
import { RemediationSidebarService } from "../../../features/remediation-management/services/remediation-sidebar.service";
import { RemediationManagementTableColumns } from "../../../features/remediation-management/models/remediation-management.models";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  standalone: true,
  selector: "app-column-settings-sidebar",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    CardModule,
    CheckboxModule,
    SharedModule,
  ],
  templateUrl: "./column-settings-sidebar.component.html",
  styleUrls: ["./column-settings-sidebar.component.scss"],
})
export class ColumnSettingsSidebarComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  initialTableColumsConfiguration: IncidentOVTableColumns[] = [];
  initialAssetsTableColumsConfiguration: AssetsTableColumns[] = [];
  initialHistoryTableColumsConfiguration: HistoryTableColumns[] = [];
  initialRemediationsTableColumnsConfiguration: RemediationManagementTableColumns[] =
    [];

  dashboardFeaturesidebarService = inject(SidebarService);
  assetsFeaturesidebarService = inject(AssetSidebarService);
  historyFeaturesidebarService = inject(HistorySidebarService);
  remediationListsidebarService = inject(RemediationSidebarService);

  selectedColumns!: IncidentOVTableColumns[];
  selectedAssetColumns!: AssetsTableColumns[];
  selectedHistoryColumns!: HistoryTableColumns[];
  selectedRemediationsColumns!: RemediationManagementTableColumns[];

  isSelectedColumnsChanhged = false;
  _tableFeature!: string;

  @Input() set tableContext(tableFeature: string) {
    if (tableFeature) {
      this._tableFeature = tableFeature;
    }

    switch (tableFeature) {
      case "dashboard":
        this.initialTableColumsConfiguration = [
          ...this.dashboardFeaturesidebarService.getInitialColumnsConfig(),
        ];

        this.dashboardFeaturesidebarService.visibleColumns$
          .pipe(
            filter(isNonNull),
            map((columns) => columns.filter((column) => !!column.visible)),
            tap((checkedColumns) => {
              this.selectedColumns = [...checkedColumns];
            })
          )
          .subscribe(noop);
        break;

      case "assetsMgmt":
        this.initialAssetsTableColumsConfiguration = [
          ...this.assetsFeaturesidebarService.getInitialColumnsConfig(),
        ];

        this.assetsFeaturesidebarService.visibleColumns$
          .pipe(
            filter(isNonNull),
            map((columns) => columns.filter((column) => !!column.visible)),
            tap((checkedColumns) => {
              this.selectedAssetColumns = [...checkedColumns];
            })
          )
          .subscribe(noop);
        break;

      case "history":
        this.initialHistoryTableColumsConfiguration = [
          ...this.historyFeaturesidebarService.getInitialColumnsConfig(),
        ];

        this.historyFeaturesidebarService.visibleColumns$
          .pipe(
            filter(isNonNull),
            map((columns) => columns.filter((column) => !!column.visible)),
            tap((checkedColumns) => {
              this.selectedHistoryColumns = [...checkedColumns];
            })
          )
          .subscribe(noop);
        break;

      case "remediationList":
        this.initialRemediationsTableColumnsConfiguration = [
          ...this.remediationListsidebarService.getInitialColumnsConfig(),
        ];

        this.remediationListsidebarService.visibleColumns$
          .pipe(
            filter(isNonNull),
            map((columns) => columns.filter((column) => !!column.visible)),
            tap((checkedColumns) => {
              this.selectedRemediationsColumns = [...checkedColumns];
            })
          )
          .subscribe(noop);
        break;
    }
  }
  @Input() isOpen = false;
  @Output() onSidebarClosing: EventEmitter<void> = new EventEmitter<void>();

  _columns = toSignal(
    this.dashboardFeaturesidebarService.visibleColumns$.pipe(
      takeUntil(this.onDestroy$)
    ),
    {
      initialValue: [...this.initialTableColumsConfiguration],
    }
  );

  get columns(): IncidentOVTableColumns[] {
    return this._columns();
  }

  _assetsColumns = toSignal(
    this.assetsFeaturesidebarService.visibleColumns$.pipe(
      takeUntil(this.onDestroy$)
    ),
    {
      initialValue: [...this.initialAssetsTableColumsConfiguration],
    }
  );

  get assetsColumns(): AssetsTableColumns[] {
    return this._assetsColumns();
  }

  _historyColumns = toSignal(
    this.historyFeaturesidebarService.visibleColumns$.pipe(
      takeUntil(this.onDestroy$)
    ),
    {
      initialValue: [...this.initialHistoryTableColumsConfiguration],
    }
  );

  get historyColumns(): HistoryTableColumns[] {
    return this._historyColumns();
  }

  _incidentRemediationsColumns = toSignal(
    this.remediationListsidebarService.visibleColumns$.pipe(
      takeUntil(this.onDestroy$)
    ),
    {
      initialValue: [...this.initialRemediationsTableColumnsConfiguration],
    }
  );

  get incidentRemediationsColumns(): RemediationManagementTableColumns[] {
    return this._incidentRemediationsColumns();
  }

  ngOnDestroy(): void {
    this.dashboardFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.assetsFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.historyFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.remediationListsidebarService.resetVisibleColumnsInitialConfig();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.onSidebarClosing.emit();
  }

  reset() {
    this.dashboardFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.assetsFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.historyFeaturesidebarService.resetVisibleColumnsInitialConfig();
    this.remediationListsidebarService.resetVisibleColumnsInitialConfig();
    this.isSelectedColumnsChanhged = false;
    this.close();
  }

  save() {
    switch (this._tableFeature) {
      case "dashboard":
        this.dashboardFeaturesidebarService.updateVisibleColumns(
          this.selectedColumns
        );
        this.close();
        break;

      case "assetsMgmt":
        this.assetsFeaturesidebarService.updateVisibleColumns(
          this.selectedAssetColumns
        );
        this.close();
        break;

      case "history":
        this.historyFeaturesidebarService.updateVisibleColumns(
          this.selectedHistoryColumns
        );
        this.close();
        break;

      case "remediationList":
        this.remediationListsidebarService.updateVisibleColumns(
          this.selectedRemediationsColumns
        );
        this.close();
        break;
    }
  }

  onColumnsCkboxesChange(event: any, column: any) {
    if (event) {
      this.isSelectedColumnsChanhged = true;
    }
  }
}
