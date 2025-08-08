import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { Table } from "primeng/table";
import { SearchableMultiselectDropdownComponent } from "../searchable-multiselect-dropdown/searchable-multiselect-dropdown.component";
import { SidebarAccordionComponent } from "../sidebar-accordion/sidebar-accordion.component";
import { DatePickerModule } from "primeng/datepicker";
import { FluidModule } from "primeng/fluid";
import { AlertFiltersComponent } from "../alert-filters/alert-filters.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, Observable } from "rxjs";
import { isNonNull } from "../../utils/rxjs-operators/noNullOperator";
import { NavigationManagerService } from "../../services/navigation-manager.service";
import { AssetStatusComponent } from "../asset-status/asset-status.component";
import { convertSetToArray } from "../../utils/array-functions";
import { AssetSidebarService } from "../../../features/asset-management/services/asset-sidebar.service";
import { IncidentStatusesComponent } from "../incident-statuses/incident-statuses.component";
import { HistorySidebarService } from "../../../features/history/services/history-sidebar.service";
import { CyberResilienceSidebarService } from "../../../features/dashboard/services/cyber-resilience-sidebar.service";
import { RemediationSidebarService } from "../../../features/remediation-management/services/remediation-sidebar.service";
import { RemediationActionTypesComponent } from "../remediation-action-types/remediation-action-types.component";
import { RemediationActionStatusesComponent } from "../remediation-action-statuses/remediation-action-statuses.component";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-table-filters-sidebar",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    CardModule,
    CheckboxModule,
    SearchableMultiselectDropdownComponent,
    SidebarAccordionComponent,
    DatePickerModule,
    FluidModule,
    FormsModule,
    AlertFiltersComponent,
    AssetStatusComponent,
    IncidentStatusesComponent,
    RemediationActionTypesComponent,
    RemediationActionStatusesComponent,
    SharedModule,
  ],
  templateUrl: "./table-filters-sidebar.component.html",
  styleUrl: "./table-filters-sidebar.component.scss",
})
export class TableFiltersSidebarComponent implements AfterViewInit, OnInit {
  @Input() table!: Table;
  @Input() isOpen = false;
  @Output() onSidebarClosing: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild("btnSave", { static: false })
  buttonSaveFiltersRef!: ElementRef<HTMLButtonElement>;

  sidebarService = inject(SidebarService);
  assetsMGMTSidebarService = inject(AssetSidebarService);
  historyIncidentsSidebarService = inject(HistorySidebarService);
  cyberResilienceSidebarService = inject(CyberResilienceSidebarService);
  incidentRemediationsSidebarService = inject(RemediationSidebarService);

  navigationManagerService = inject(NavigationManagerService);

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  decksSelectedValues: string[] = [];
  framesSelectedValues: string[] = [];
  descriptionSelectedValues: string[] = [];
  historyDescriptionSelectedValues: string[] = [];
  mvzSelectedValues: string[] = [];

  markPiecesSelectedValues: string[] = [];
  typeSelectedValues: string[] = [];
  nameSelectedValues: string[] = [];

  selectedAlertsLevels!: string[];
  selectedAlertStatus!: string[];
  selectedIncidentStatusesValues!: string[];
  selectedCyberResilienceStatusesValues!: string[];
  selectedRemediationsIncidentDescriptionValues!: string[];
  selectedRemediationsActionDescriptionValues!: string[];
  selectedRemediationsActionTypes!: string[];
  selectedRemediationsActionStatuses!: string[];

  activeFilters!: any;
  currentHostingPage$!: Observable<string>;

  descriptionFieldOptions = toSignal(
    this.sidebarService.getIncidentsDescriptionOptions().pipe(filter(isNonNull))
  );

  btnSaveActiveDashboard = toSignal(
    this.sidebarService.appliedFiltersAmountSubject.pipe(
      filter(isNonNull),
      map((appliedFiltersAmountSubject) => appliedFiltersAmountSubject > 0)
    )
  );

  btnSaveActiveAssetMngmt = toSignal(
    this.assetsMGMTSidebarService.appliedFiltersAmountSubject.pipe(
      filter(isNonNull),
      map((appliedFiltersAmountSubject) => appliedFiltersAmountSubject > 0)
    )
  );

  btnSaveActiveHistoryPage = toSignal(
    this.historyIncidentsSidebarService.appliedFiltersAmountSubject.pipe(
      filter(isNonNull),
      map((appliedFiltersAmountSubject) => appliedFiltersAmountSubject > 0)
    )
  );

  btnSaveActiveCyberResilience = toSignal(
    this.cyberResilienceSidebarService.appliedFiltersAmountSubject.pipe(
      filter(isNonNull),
      map((appliedFiltersAmountSubject) => appliedFiltersAmountSubject > 0)
    )
  );

  btnSaveActiveIncidentRemediations = toSignal(
    this.incidentRemediationsSidebarService.appliedFiltersAmountSubject.pipe(
      filter(isNonNull),
      map((appliedFiltersAmountSubject) => appliedFiltersAmountSubject > 0)
    )
  );

  ngOnInit(): void {
    this.resetDashboardFilters();
  }

  constructor() {
    this.activeFilters = {
      levels: this.selectedAlertsLevels,
      dates: {
        start: this.selectedStartDate,
        end: this.selectedEndDate,
      },
      descriptionsSelections: this.descriptionSelectedValues,
      historyDescriptionSelections: this.historyDescriptionSelectedValues,
      decksSelections: this.decksSelectedValues,
      framesSelections: this.framesSelectedValues,
      mvzSelections: this.mvzSelectedValues,

      assetsStatus: this.selectedAlertStatus,
      markPiecesSelections: this.markPiecesSelectedValues,
      typeSelections: this.typeSelectedValues,
      nameSelections: this.nameSelectedValues,

      incidentStatuses: this.selectedIncidentStatusesValues,

      cyberResilienceAssetStatuses: this.selectedCyberResilienceStatusesValues,

      remediationsIncidentDescriptions:
        this.selectedRemediationsIncidentDescriptionValues,
      remediationsActionDescriptions:
        this.selectedRemediationsActionDescriptionValues,
      remediationActionTypes: this.selectedRemediationsActionTypes,
      remediationActionStatuses: this.selectedRemediationsActionStatuses,
    };

    this.currentHostingPage$ = this.navigationManagerService.hostingPage;
    //this.sidebarService.appliedFiltersAmountSubject;
  }

  ngAfterViewInit(): void {
    if (this.buttonSaveFiltersRef && this.buttonSaveFiltersRef?.nativeElement) {
      this.buttonSaveFiltersRef.nativeElement.disabled = true;
      this.buttonSaveFiltersRef.nativeElement.style.cursor = "default";
    }
  }

  saveDashboardFilters() {
    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
    this.sidebarService.updateFilters(this.activeFilters);

    this.close();
  }

  saveAssetMngmtFilters() {
    this.assetsMGMTSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
    this.assetsMGMTSidebarService.updateFilters(this.activeFilters);

    this.close();
  }

  saveHistoryIncidentsFilters() {
    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
    this.historyIncidentsSidebarService.updateFilters(this.activeFilters);

    this.close();
  }

  saveCyberResilienceFilters() {
    this.cyberResilienceSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
    this.cyberResilienceSidebarService.updateFilters(this.activeFilters);

    this.close();
  }

  saveIncidentRemediationsFilters() {
    this.incidentRemediationsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
    this.incidentRemediationsSidebarService.updateFilters(this.activeFilters);

    this.close();
  }

  private countAppliedFilters(activeFilters: any): number {
    let returningFiltersAppliedAmount = 0;

    if (activeFilters?.levels && activeFilters?.levels.length) {
      returningFiltersAppliedAmount++;
    }

    if (activeFilters?.assetsStatus && activeFilters?.assetsStatus.length) {
      returningFiltersAppliedAmount++;
    }

    if (
      activeFilters?.incidentStatuses &&
      activeFilters?.incidentStatuses.length
    ) {
      returningFiltersAppliedAmount++;
    }

    if (
      activeFilters?.remediationActionTypes &&
      activeFilters?.remediationActionTypes.length
    ) {
      returningFiltersAppliedAmount++;
    }

    if (
      activeFilters?.remediationActionStatuses &&
      activeFilters?.remediationActionStatuses.length
    ) {
      returningFiltersAppliedAmount++;
    }

    if (
      activeFilters?.cyberResilienceAssetStatuses &&
      activeFilters?.cyberResilienceAssetStatuses.length
    ) {
      returningFiltersAppliedAmount++;
    }

    if (
      activeFilters?.descriptionsSelections &&
      activeFilters?.descriptionsSelections.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.historyDescriptionSelections &&
      activeFilters?.historyDescriptionSelections.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.decksSelections &&
      activeFilters?.decksSelections.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.framesSelections &&
      activeFilters?.framesSelections.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (activeFilters?.mvzSelections && activeFilters?.mvzSelections.length) {
      returningFiltersAppliedAmount++;
    }
    if (activeFilters?.dates?.start) {
      returningFiltersAppliedAmount++;
    }
    if (activeFilters?.dates?.end) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.markPiecesSelections &&
      activeFilters?.markPiecesSelections.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (activeFilters?.typeSelections && activeFilters?.typeSelections.length) {
      returningFiltersAppliedAmount++;
    }
    if (activeFilters?.nameSelections && activeFilters?.nameSelections.length) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.remediationsIncidentDescriptions &&
      activeFilters?.remediationsIncidentDescriptions.length
    ) {
      returningFiltersAppliedAmount++;
    }
    if (
      activeFilters?.remediationsActionDescriptions &&
      activeFilters?.remediationsActionDescriptions.length
    ) {
      returningFiltersAppliedAmount++;
    }

    if (
      returningFiltersAppliedAmount === 0 &&
      this.buttonSaveFiltersRef &&
      this.buttonSaveFiltersRef?.nativeElement
    ) {
      this.buttonSaveFiltersRef.nativeElement.disabled = true;
      this.buttonSaveFiltersRef.nativeElement.style.cursor = "default";
    } else if (
      returningFiltersAppliedAmount > 0 &&
      this.buttonSaveFiltersRef &&
      this.buttonSaveFiltersRef?.nativeElement
    ) {
      this.buttonSaveFiltersRef.nativeElement.disabled = false;
      this.buttonSaveFiltersRef.nativeElement.style.cursor = "pointer";
    }

    return returningFiltersAppliedAmount;
  }

  checkIfNoMoreFiltersAreApplied(): boolean {
    return (
      !this.selectedAlertsLevels?.length &&
      !this.descriptionSelectedValues?.length &&
      !this.historyDescriptionSelectedValues?.length &&
      !this.selectedStartDate &&
      !this.selectedEndDate &&
      !this.decksSelectedValues?.length &&
      !this.framesSelectedValues?.length &&
      !this.mvzSelectedValues?.length &&
      !this.selectedAlertStatus?.length &&
      !this.markPiecesSelectedValues?.length &&
      !this.nameSelectedValues?.length &&
      !this.typeSelectedValues?.length &&
      !this.selectedIncidentStatusesValues?.length &&
      !this.selectedCyberResilienceStatusesValues?.length &&
      !this.selectedRemediationsIncidentDescriptionValues?.length &&
      !this.selectedRemediationsActionDescriptionValues?.length &&
      !this.selectedRemediationsActionTypes?.length &&
      !this.selectedRemediationsActionStatuses?.length
    );
  }

  resetDashboardFilters() {
    // Resetta tutti i valori
    this.selectedAlertsLevels = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.descriptionSelectedValues = [];
    this.historyDescriptionSelectedValues = [];
    this.decksSelectedValues = [];
    this.framesSelectedValues = [];
    this.mvzSelectedValues = [];

    const noAppliedFilters = {
      levels: [],
      dates: {
        start: null,
        end: null,
      },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      markPiecesSelections: [],
      typeSelections: [],
      nameSelections: [],
      assetsStatus: [],

      incidentStatuses: [],
      cyberResilienceAssetStatuses: [],
    };

    // Notifica il reset
    //this.sidebarService.triggerReset();
    this.activeFilters = { ...noAppliedFilters };
    this.sidebarService.updateFilters(noAppliedFilters);
    this.sidebarService.triggerReset();
    this.close();
  }

  resetAssetMngmtFilters() {
    // Resetta tutti i valori
    this.markPiecesSelectedValues = [];
    this.typeSelectedValues = [];
    this.nameSelectedValues = [];
    this.selectedAlertStatus = [];

    const noAppliedFilters = {
      levels: [],
      dates: {
        start: null,
        end: null,
      },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],

      markPiecesSelections: [],
      typeSelections: [],
      nameSelections: [],
      assetsStatus: [],

      incidentStatuses: [],
      cyberResilienceAssetStatuses: [],
    };

    // Notifica il reset
    //this.sidebarService.triggerReset();
    this.activeFilters = { ...noAppliedFilters };
    this.assetsMGMTSidebarService.updateFilters(noAppliedFilters);
    this.assetsMGMTSidebarService.triggerReset();
    this.close();
  }

  resetHistoryIncidentsFilters() {
    // Resetta tutti i valori
    this.selectedAlertsLevels = [];
    this.selectedIncidentStatusesValues = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.descriptionSelectedValues = [];
    this.historyDescriptionSelectedValues = [];
    this.decksSelectedValues = [];
    this.framesSelectedValues = [];
    this.mvzSelectedValues = [];
    this.selectedCyberResilienceStatusesValues = [];
    this.selectedRemediationsIncidentDescriptionValues = [];
    this.selectedRemediationsActionDescriptionValues = [];
    this.selectedRemediationsActionTypes = [];
    this.selectedRemediationsActionStatuses = [];

    const noAppliedFilters = {
      levels: [],
      dates: {
        start: null,
        end: null,
      },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      markPiecesSelections: [],
      typeSelections: [],
      nameSelections: [],
      assetsStatus: [],
      incidentStatuses: [],
      cyberResilienceAssetStatuses: [],
    };

    // Notifica il reset
    this.activeFilters = { ...noAppliedFilters };
    this.historyIncidentsSidebarService.updateFilters(noAppliedFilters);
    this.historyIncidentsSidebarService.triggerReset();
    this.close();
  }

  resetCyberResilienceFilters() {
    this.selectedAlertsLevels = [];
    this.selectedIncidentStatusesValues = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.descriptionSelectedValues = [];
    this.historyDescriptionSelectedValues = [];
    this.decksSelectedValues = [];
    this.framesSelectedValues = [];
    this.mvzSelectedValues = [];
    this.selectedCyberResilienceStatusesValues = [];
    this.selectedRemediationsIncidentDescriptionValues = [];
    this.selectedRemediationsActionDescriptionValues = [];
    this.selectedRemediationsActionTypes = [];
    this.selectedRemediationsActionStatuses = [];

    const noAppliedFilters = {
      levels: [],
      dates: {
        start: null,
        end: null,
      },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      markPiecesSelections: [],
      typeSelections: [],
      nameSelections: [],
      assetsStatus: [],
      incidentStatuses: [],
      cyberResilienceAssetStatuses: [],
    };

    // Notifica il reset
    this.activeFilters = { ...noAppliedFilters };
    this.cyberResilienceSidebarService.updateFilters(noAppliedFilters);
    this.cyberResilienceSidebarService.triggerReset();
    this.close();
  }

  resetIncidentRemediationsFilters() {
    this.selectedAlertsLevels = [];
    this.selectedIncidentStatusesValues = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.descriptionSelectedValues = [];
    this.historyDescriptionSelectedValues = [];
    this.decksSelectedValues = [];
    this.framesSelectedValues = [];
    this.mvzSelectedValues = [];
    this.selectedCyberResilienceStatusesValues = [];
    this.selectedRemediationsIncidentDescriptionValues = [];
    this.selectedRemediationsActionDescriptionValues = [];
    this.selectedRemediationsActionTypes = [];
    this.selectedRemediationsActionStatuses = [];

    const noAppliedFilters = {
      levels: [],
      dates: {
        start: null,
        end: null,
      },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      markPiecesSelections: [],
      typeSelections: [],
      nameSelections: [],
      assetsStatus: [],
      incidentStatuses: [],
      cyberResilienceAssetStatuses: [],
      remediationsIncidentDescriptions: [],
      remediationsActionDescriptions: [],
      remediationActionTypes: [],
      remediationActionStatuses: [],
    };

    // Notifica il reset
    this.activeFilters = { ...noAppliedFilters };
    this.incidentRemediationsSidebarService.updateFilters(noAppliedFilters);
    this.incidentRemediationsSidebarService.triggerReset();
    this.close();
  }

  descriptionsSelectionChange(selectedValues: any) {
    this.descriptionSelectedValues = convertSetToArray(
      selectedValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      descriptionsSelections: this.descriptionSelectedValues,
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  historyDescriptionsSelectionChange(selectedValues: any) {
    this.historyDescriptionSelectedValues = convertSetToArray(
      selectedValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      historyDescriptionSelections: this.historyDescriptionSelectedValues,
    };

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  decksSelectionChange(selectedValues: any) {
    this.decksSelectedValues = convertSetToArray(selectedValues as Set<string>);

    this.activeFilters = {
      ...this.activeFilters,
      decksSelections: this.decksSelectedValues,
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  framesSelectionChange(selectedValues: any) {
    this.framesSelectedValues = convertSetToArray(
      selectedValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      framesSelections: this.framesSelectedValues,
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  mvzSelectionChange(selectedValues: any) {
    this.mvzSelectedValues = convertSetToArray(selectedValues as Set<string>);

    this.activeFilters = {
      ...this.activeFilters,
      mvzSelections: this.mvzSelectedValues,
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  onRemediationIncidentDescriptionSelectionChange(
    selectedRemediationDescValues: any
  ) {
    this.selectedRemediationsIncidentDescriptionValues = convertSetToArray(
      selectedRemediationDescValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      remediationsIncidentDescriptions:
        this.selectedRemediationsIncidentDescriptionValues,
    };

    this.incidentRemediationsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  onRemediationActionDescriptionSelectionChange(
    selectedRemediationDescValues: any
  ) {
    this.selectedRemediationsActionDescriptionValues = convertSetToArray(
      selectedRemediationDescValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      remediationsActionDescriptions:
        this.selectedRemediationsActionDescriptionValues,
    };

    this.incidentRemediationsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  markpieceSelectionChange(selectedValues: any) {
    this.markPiecesSelectedValues = convertSetToArray(
      selectedValues as Set<string>
    );

    this.activeFilters = {
      ...this.activeFilters,
      markPiecesSelections: this.markPiecesSelectedValues,
    };

    this.assetsMGMTSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  typeSelectionChange(selectedValues: any) {
    this.typeSelectedValues = convertSetToArray(selectedValues as Set<string>);

    this.activeFilters = {
      ...this.activeFilters,
      typeSelections: this.typeSelectedValues,
    };

    this.assetsMGMTSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  nameSelectionChange(selectedValues: any) {
    this.nameSelectedValues = convertSetToArray(selectedValues as Set<string>);

    this.activeFilters = {
      ...this.activeFilters,
      nameSelections: this.nameSelectedValues,
    };

    this.assetsMGMTSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  onEndDateSelect(event: any) {
    this.activeFilters = {
      ...this.activeFilters,
      dates: { ...this.activeFilters?.dates, end: this.selectedEndDate },
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  onStartDateSelect(event: any) {
    this.activeFilters = {
      ...this.activeFilters,
      dates: { ...this.activeFilters?.dates, start: this.selectedStartDate },
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getAlertsSet(alertsSet: any) {
    this.selectedAlertsLevels = [...alertsSet];

    this.activeFilters = {
      ...this.activeFilters,
      levels: this.selectedAlertsLevels,
    };

    this.sidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getIncidentStatusSet(incidentStatusSet: any) {
    this.selectedIncidentStatusesValues = [...incidentStatusSet];

    this.activeFilters = {
      ...this.activeFilters,
      incidentStatuses: this.selectedIncidentStatusesValues,
    };

    this.historyIncidentsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getRemediationActionTypesSet(remediationActionTypesSet: any) {
    this.selectedRemediationsActionTypes = [...remediationActionTypesSet];

    this.activeFilters = {
      ...this.activeFilters,
      remediationActionTypes: this.selectedRemediationsActionTypes,
    };

    this.incidentRemediationsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getRemediationActionStatusesSet(remediationActionStatusesSet: any) {
    this.selectedRemediationsActionStatuses = [...remediationActionStatusesSet];

    this.activeFilters = {
      ...this.activeFilters,
      remediationActionStatuses: this.selectedRemediationsActionStatuses,
    };

    this.incidentRemediationsSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getAssetsStatusSet(assetsStatusSet: any) {
    this.selectedAlertStatus = [...assetsStatusSet];

    this.activeFilters = {
      ...this.activeFilters,
      assetsStatus: this.selectedAlertStatus,
    };

    this.assetsMGMTSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  getAssetsStatusInCyberResilienceSet(cyberResilenceStatusSet: any) {
    this.selectedCyberResilienceStatusesValues = [...cyberResilenceStatusSet];

    this.activeFilters = {
      ...this.activeFilters,
      cyberResilienceAssetStatuses: this.selectedCyberResilienceStatusesValues,
    };

    this.cyberResilienceSidebarService.updateAppliedFiltersCount(
      this.countAppliedFilters(this.activeFilters)
    );
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.onSidebarClosing.emit();
    if (!this.checkIfNoMoreFiltersAreApplied()) {
      this.sidebarService.updateFilters(this.activeFilters);
      this.assetsMGMTSidebarService.updateFilters(this.activeFilters);
      this.historyIncidentsSidebarService.updateFilters(this.activeFilters);
      this.cyberResilienceSidebarService.updateFilters(this.activeFilters);
    }
  }
}
