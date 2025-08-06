import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ElementRef,
  HostListener,
  Inject,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { Table } from "primeng/table";
import { InputGroupModule } from "primeng/inputgroup";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { filter, noop, Subscription, tap } from "rxjs";
import { isNonNull } from "../../utils/rxjs-operators/noNullOperator";
import { convertSetToArray } from "../../utils/array-functions";
import { AssetSidebarService } from "../../../features/asset-management/services/asset-sidebar.service";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";
import { RemediationSidebarService } from "../../../features/remediation-management/services/remediation-sidebar.service";

@Component({
  selector: "app-searchable-multiselect-dropdown",
  imports: [
    CheckboxModule,
    ButtonModule,
    InputGroupModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClickOutsideDirective
  ],
  templateUrl: "./searchable-multiselect-dropdown.component.html",
  styleUrl: "./searchable-multiselect-dropdown.component.scss",
})
export class SearchableMultiselectDropdownComponent
  implements OnInit, OnDestroy
{
  sidebarService = inject(SidebarService);
  assetsMngmtSidebarService = inject(AssetSidebarService);
  remediationsSidebarService = inject(RemediationSidebarService);

  @Input() table!: Table;
  @Input() fieldName?: string;
  @Input() multiselectTitle?: string;
  @Input() multiselectHint?: string;
  @Output() descriptionsSelectionChange = new EventEmitter<Set<string>>();
  @Output() decksSelectionChange = new EventEmitter<Set<string>>();
  @Output() framesSelectionChange = new EventEmitter<Set<string>>();
  @Output() mvzSelectionChange = new EventEmitter<Set<string>>();
  @Output() submitSelection = new EventEmitter<any[]>();

  @Output() markpieceSelectionChange = new EventEmitter<Set<string>>();
  @Output() typeSelectionChange = new EventEmitter<Set<string>>();
  @Output() nameSelectionChange = new EventEmitter<Set<string>>();

  @Output() remediationIncidentDescriptionSelectionChange = new EventEmitter<Set<string>>();
  @Output() remediationActionDescriptionSelectionChange = new EventEmitter<Set<string>>();

  dropdownOpen = false;
  searchTerm = "";
  filteredDescriptionOptions!: string[];
  filteredDecksOptions!: string[];
  filteredFramesOptions!: string[];
  filteredMVZOptions!: string[];

  fiteredMarkPieceOptions!: string[];
  fiteredTypeOptions!: string[];
  fiteredNameOptions!: string[];
  fiteredActionDescriptionOptions!: string[];
  fiteredIncidentDescriptionOptions!: string[];
  selected: Set<string> = new Set();
  selectedDisplayText = "";

  private resetSubscriptionDashboard!: Subscription;
  private resetSubscriptionAssetsMngmt!: Subscription;
  private resetSubscriptionRemediationsPage!: Subscription;

  ngOnInit(): void {
    // Sottoscrizione al reset dashboard
    this.resetSubscriptionDashboard = this.sidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );

    // Sottoscrizione al reset pagina assets
    this.resetSubscriptionAssetsMngmt = this.assetsMngmtSidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );

    // Sottoscrizione al reset pagina remediations
    this.resetSubscriptionRemediationsPage = this.remediationsSidebarService.resetTriggered.subscribe(
      () => {
        this.resetFilters();
      }
    );
  }

  ngOnDestroy() {
    this.resetSubscriptionDashboard.unsubscribe();
    this.resetSubscriptionAssetsMngmt.unsubscribe();
    this.resetSubscriptionRemediationsPage.unsubscribe();
  }

  private resetFilters() {
    this.dropdownOpen = false;
    this.searchTerm = "";
    this.selected = new Set();
    this.selectedDisplayText = "";
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.filterOptions();
  }

  private getDescriptionFilterOptions(searchTerm: string): void {
    this.sidebarService
      .getIncidentsDescriptionOptions()
      .pipe(
        filter(isNonNull),
        tap((incidentsDescriptionOptions) => {
          const incidentsDescriptionOptionsSet: Set<string> = new Set();

          incidentsDescriptionOptions?.forEach((incidentsDescriptionOption) => {
            if (
              !incidentsDescriptionOptionsSet.has(incidentsDescriptionOption)
            ) {
              incidentsDescriptionOptionsSet.add(incidentsDescriptionOption);
            }
          });

          const incidentsDescriptionOptionsArr = convertSetToArray(
            incidentsDescriptionOptionsSet
          );

          this.filteredDescriptionOptions =
            incidentsDescriptionOptionsArr.filter((opt) =>
              opt.toLowerCase().includes(searchTerm)
            );
        })
      )
      .subscribe(noop);
  }

  private getDecksFilterOptions(searchTerm: string): void {
    this.sidebarService
      .getIncidentsDeckOptions()
      .pipe(
        filter(isNonNull),
        tap((incidentsDecksOptions) => {
          this.filteredDecksOptions = incidentsDecksOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getFramesFilterOptions(searchTerm: string): void {
    this.sidebarService
      .getIncidentsFrameOptions()
      .pipe(
        filter(isNonNull),
        tap((incidentsFramesOptions) => {
          this.filteredFramesOptions = incidentsFramesOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getMVZFilterOptions(searchTerm: string): void {
    this.sidebarService
      .getIncidentsMVZOptions()
      .pipe(
        filter(isNonNull),
        tap((incidentsMVZOptions) => {
          const incidentsMVZOptionsSet: Set<string> = new Set();

          incidentsMVZOptions?.forEach((incidentsMVZOption) => {
            if (!incidentsMVZOptionsSet.has(String(incidentsMVZOption))) {
              incidentsMVZOptionsSet.add(String(incidentsMVZOption));
            }
          });

          const incidentsMVZOptionsArr = convertSetToArray(
            incidentsMVZOptionsSet
          );

          this.filteredMVZOptions = incidentsMVZOptionsArr
            .filter((opt) => opt.toLowerCase().includes(searchTerm))
            .sort((a, b) => parseInt(a) - parseInt(b));
        })
      )
      .subscribe(noop);
  }

  private getMarkPieceFilterOptions(searchTerm: string): void {
    this.assetsMngmtSidebarService
      .getAssetsMarkPiecesOptions()
      .pipe(
        filter(isNonNull),
        tap((assetsMarkPiecesOptions) => {
          this.fiteredMarkPieceOptions = assetsMarkPiecesOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getTypeFilterOptions(searchTerm: string): void {
    this.assetsMngmtSidebarService
      .getAssetsDescriptionOptions()
      .pipe(
        filter(isNonNull),
        tap((assetsTypeOptions) => {
          this.fiteredTypeOptions = assetsTypeOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getNameFilterOptions(searchTerm: string): void {
    this.assetsMngmtSidebarService
      .getAssetsNameOptions()
      .pipe(
        filter(isNonNull),
        tap((assetsNameOptions) => {
          this.fiteredNameOptions = assetsNameOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getActionDescriptionFilterOptions(searchTerm: string): void {
    this.remediationsSidebarService
      .getRemediationActionDescriptionOptions()
      .pipe(
        filter(isNonNull),
        tap((remediationsActionDescriptionOptions) => {
          this.fiteredActionDescriptionOptions = remediationsActionDescriptionOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  private getIncidentDescriptionFilterOptions(searchTerm: string): void {
    this.remediationsSidebarService
      .getRemediationIncidentDescriptionOptions()
      .pipe(
        filter(isNonNull),
        tap((remediationsIncidentDescriptionOptions) => {
          this.fiteredIncidentDescriptionOptions = remediationsIncidentDescriptionOptions.filter((opt) =>
            opt.toLowerCase().includes(searchTerm)
          );
        })
      )
      .subscribe(noop);
  }

  filterOptions() {
    const term = this.searchTerm.toLowerCase();
    this.getDescriptionFilterOptions(term);
    this.getDecksFilterOptions(term);
    this.getFramesFilterOptions(term);
    this.getMVZFilterOptions(term);

    this.getMarkPieceFilterOptions(term);
    this.getTypeFilterOptions(term);
    this.getNameFilterOptions(term);
    this.getActionDescriptionFilterOptions(term);
    this.getIncidentDescriptionFilterOptions(term);
  }

  private countMaxArrayItemLength(arrayToScan: string[]): number {
    let maxItemLength = 0;
    arrayToScan?.forEach((item) => {
      if (item.length > maxItemLength) {
        maxItemLength = item.length;
      }
    });

    return maxItemLength;
  }

  private updateSelectedDisplayText(): void {
    if (this.countMaxArrayItemLength(Array.from(this.selected)) > 3) {
      this.selectedDisplayText =
        Array.from(this.selected).length > 1
          ? `${Array.from(this.selected).length} options selected`
          : Array.from(this.selected).join(", ");
    } else {
      this.selectedDisplayText =
        Array.from(this.selected).length > 6
          ? `${Array.from(this.selected).length} options selected`
          : Array.from(this.selected).join(", ");
    }
  }

  toggleSelection(option: string, fieldName: string) {
    if (this.selected.has(option)) {
      this.selected.delete(option);
    } else {
      this.selected.add(option);
    }

    // Aggiorna il testo visualizzato
    this.updateSelectedDisplayText();

    switch (fieldName) {
      case "description":
        this.descriptionsSelectionChange.emit(this.selected);
        break;

      case "deck":
        this.decksSelectionChange.emit(this.selected);
        break;

      case "frame":
        this.framesSelectionChange.emit(this.selected);
        break;

      case "mvz":
        this.mvzSelectionChange.emit(this.selected);
        break;

      case "markPiece":
        this.markpieceSelectionChange.emit(this.selected);
        break;

      case "type":
        this.typeSelectionChange.emit(this.selected);
        break;

      case "name":
        this.nameSelectionChange.emit(this.selected);
        break;

      case "incidentDescription":
        this.remediationIncidentDescriptionSelectionChange.emit(this.selected);
        break;

      case "actionDescription":
        this.remediationActionDescriptionSelectionChange.emit(this.selected);
        break;
    }
  }

  isSelected(option: string): boolean {
    return this.selected.has(option);
  }

  onSelectionChange() {
    //this.selectionChange.emit(this.selectedItems);
  }

  onSubmit() {
    // this.submitSelection.emit(this.selectedItems);
    // // Chiudi la sidebar o esegui altre azioni
  }

  clickedOutsideDD() {
    this.dropdownOpen = false;
  }
}
