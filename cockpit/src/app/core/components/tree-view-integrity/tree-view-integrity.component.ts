import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import {
  AccordionItem,
  mapFunctionNodesToAccordionItems,
} from "../../models/tree-view.models";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";
import { CyberResilienceParametersComponent } from "../cyber-resilience-parameters/cyber-resilience-parameters.component";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { fromCyberResilience } from "../../../features/dashboard/state";
import { noop, Observable, Subscription, tap } from "rxjs";
import { NavigationManagerService } from "../../services/navigation-manager.service";
import { CyberResilienceSidebarService } from "../../../features/dashboard/services/cyber-resilience-sidebar.service";
import { Table } from "primeng/table";
import { NavigationTargetEnum } from "../../enums/navigation-targets.enum";
import { TableFiltersSidebarComponent } from "../table-filters-sidebar/table-filters-sidebar.component";
import { CountUpDirective } from "../../directives/count-up.directive";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-tree-view-integrity",
  standalone: true,
  imports: [
    TreeViewNodeComponent,
    CyberResilienceParametersComponent,
    FormsModule,
    CommonModule,
    TableFiltersSidebarComponent,
    CountUpDirective,
    SharedModule,
  ],
  templateUrl: "./tree-view-integrity.component.html",
  styleUrl: "./tree-view-integrity.component.scss",
})
export class TreeViewIntegrityComponent implements OnInit, OnDestroy {
  private filterSubscription!: Subscription;
  private resetSubscription!: Subscription;

  shoFilterSidebar = false;
  private sidebarService = inject(CyberResilienceSidebarService);

  private readonly store = inject(Store);
  navigationManagerService = inject(NavigationManagerService);
  crOverviewManager = inject(CyberResilienceOVManagerService);
  // cyberResilienceFunctionality = toSignal(
  //   this.crOverviewManager.selectedCyberResiliencePerformance$,
  //   { initialValue: null }
  // );

  macroFunctioSelected = signal<string>("");
  countCompromisedAssets = toSignal(
    this.crOverviewManager.countCompromisedAssets$()
  );

  countCompromisedAssetsNumber = computed<number>(() => {
    return this.countCompromisedAssets() as number;
  });

  countOperatingAssets = toSignal(
    this.crOverviewManager.countOperationalAssets$()
  );

  countOperatingAssetsNumber = computed<number>(() => {
    return this.countOperatingAssets() as number;
  });

  shipFunctions = toSignal(
    this.store.select(fromCyberResilience.selectShipFunctions),
    {
      initialValue: [],
    }
  );

  accordionData = computed<AccordionItem[]>(() => {
    const returningData: AccordionItem[] = (mapFunctionNodesToAccordionItems(
      this.shipFunctions() ?? []
    ).filter(
      (macroFunctions) => macroFunctions?.title === this.macroFunctioSelected()
    )[0]?.children || []) as AccordionItem[];

    this.sidebarService.updateShipFunctionsList(returningData);

    return returningData;
  });

  //originalShipFunctions: AccordionItem[] = [];
  searchTerm = "";
  filteredData: AccordionItem[] | null = null;
  table!: Table;
  activeSidebarFiltersCount$!: Observable<number>;

  constructor() {
    this.activeSidebarFiltersCount$ =
      this.sidebarService.appliedFiltersAmountSubject;
  }

  // ngOnInit(): void {
  //   this.crOverviewManager.selectedCyberResiliencePerformance$.pipe(
  //     tap(selectedCyberResiliencePerformance => {
  //       if(selectedCyberResiliencePerformance){
  //         this.macroFunctioSelected.set(selectedCyberResiliencePerformance?.name);
  //       }
  //     })
  //   ).subscribe(noop);

  //   this.navigationManagerService.updateCurrentHostingPage(
  //     NavigationTargetEnum.dashboard_cyber_resilience
  //   );

  //   // Salva una copia originale dei dati
  //   this.originalShipFunctions = [...this.accordionData()];

  //   // Sottoscrizione ai filtri
  //   this.filterSubscription = this.sidebarService.currentFilters.subscribe(
  //     (filters) => {
  //       this.applyFilters(filters);
  //     }
  //   );

  //   // Sottoscrizione al reset
  //   this.resetSubscription = this.sidebarService.resetTriggered.subscribe(
  //     () => {
  //       this.resetFilters();
  //     }
  //   );
  // }

  // Modifica ngOnInit:

  ngOnInit(): void {
    this.crOverviewManager.selectedCyberResiliencePerformance$
      .pipe(
        tap((selectedCyberResiliencePerformance) => {
          if (selectedCyberResiliencePerformance) {
            this.macroFunctioSelected.set(
              selectedCyberResiliencePerformance?.name
            );
          }
        })
      )
      .subscribe(noop);

    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.dashboard_cyber_resilience
    );

    // Sottoscrizione ai filtri
    this.filterSubscription = this.sidebarService.currentFilters.subscribe(
      (filters) => {
        if (!this.checkIfNoMoreFiltersAreApplied(filters)) {
          this.applyFilters(filters);
        }
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
    this.sidebarService.triggerReset();
    this.filterSubscription.unsubscribe();
    this.resetSubscription.unsubscribe();
  }

  private checkIfNoMoreFiltersAreApplied(filters: any): boolean {
    return (
      !filters.selectedAlertsLevels?.length &&
      !filters.descriptionSelectedValues?.length &&
      !filters.cyberResilienceAssetStatuses?.length &&
      !filters.selectedStartDate &&
      !filters.selectedEndDate &&
      !filters.decksSelectedValues?.length &&
      !filters.framesSelectedValues?.length &&
      !filters.mvzSelectedValues?.length &&
      !filters.selectedAlertStatus?.length &&
      !filters.markPiecesSelectedValues?.length &&
      !filters.nameSelectedValues?.length &&
      !filters.typeSelectedValues?.length &&
      !filters.selectedIncidentStatusesValues?.length &&
      !filters.selectedCyberResilienceStatusesValues?.length &&
      !filters.selectedRemediationsIncidentDescriptionValues?.length &&
      !filters.selectedRemediationsActionDescriptionValues?.length &&
      !filters.selectedRemediationsActionTypes?.length &&
      !filters.selectedRemediationsActionStatuses?.length
    );
  }

  private deepFilterByStatus(
    node: AccordionItem,
    validStatuses: string[]
  ): AccordionItem | null {
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;

    if (!hasChildren) {
      if (
        node.assetState &&
        validStatuses.includes(node.assetState.toUpperCase())
      ) {
        return { ...node };
      } else {
        return null;
      }
    }

    const filteredChildren = (node.children as AccordionItem[])
      .map((child) => this.deepFilterByStatus(child, validStatuses))
      .filter((child) => child !== null) as AccordionItem[];

    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }

    return null;
  }

  private checkIfAccordionItemHasStatusFilter(
    accordionItemToCheck: AccordionItem,
    assetStatus: string
  ): boolean {
    if (
      accordionItemToCheck &&
      (!accordionItemToCheck.children || !accordionItemToCheck.children.length)
    ) {
      return (
        accordionItemToCheck.assetState?.toUpperCase() ===
        assetStatus.toUpperCase()
      );
    } else {
      return (accordionItemToCheck.children as AccordionItem[]).some((child) =>
        this.checkIfAccordionItemHasStatusFilter(child, assetStatus)
      );
    }
  }

  // private applyFilters(filters: any) {
  //   if (
  //     !filters?.cyberResilienceAssetStatuses ||
  //     filters.cyberResilienceAssetStatuses.length === 0
  //   ) {
  //     this.filteredData = [...this.originalShipFunctions];
  //     return;
  //   }

  //   const validStatuses = filters.cyberResilienceAssetStatuses.map(
  //     (s: string) => s.toUpperCase()
  //   );

  //   const filtered = this.originalShipFunctions
  //     .map((node) => this.deepFilterByStatus(node, validStatuses))
  //     .filter((node) => node !== null) as AccordionItem[];

  //   this.filteredData = filtered;
  // }

  // Modifica applyFilters:
  private applyFilters(filters: any) {
    if (
      !filters?.cyberResilienceAssetStatuses ||
      filters.cyberResilienceAssetStatuses.length === 0
    ) {
      this.filteredData = [...this.accordionData()];
      return;
    }

    const validStatuses = filters.cyberResilienceAssetStatuses.map(
      (s: string) => s.toUpperCase()
    );

    const filtered = this.accordionData()
      .map((node) => this.deepFilterByStatus(node, validStatuses))
      .filter((node) => node !== null) as AccordionItem[];

    this.filteredData = filtered;
  }

  // private resetFilters() {
  //   this.filteredData = [...this.originalShipFunctions];
  // }

  // Modifica resetFilters:
  private resetFilters() {
    this.filteredData = [...this.accordionData()];
  }

  // filterNodes() {
  //   if (!this.searchTerm) {
  //     this.filteredData = null;
  //     return;
  //   }

  //   /**
  //    * Raccogli gli stati di espansione da tutti gli elementi dell'array
  //    */
  //   const expandedStates = this.accordionData().map((item) =>
  //     this.collectExpandedStates(item)
  //   );

  //   /**
  //    * Filtra tutti gli elementi dell'array
  //    */
  //   this.filteredData = this.accordionData()
  //     .map((item) => this.deepFilter(item, this.searchTerm.toLowerCase()))
  //     .filter((item) => item !== null) as AccordionItem[];

  //   /**
  //    * Se non ci sono risultati, crea un array con un elemento vuoto
  //    */
  //   if (this.filteredData.length === 0) {
  //     this.filteredData = [
  //       {
  //         id: "no-results",
  //         title: "No results found",
  //         children: [],
  //       },
  //     ];
  //     return;
  //   }

  //   /**
  //    * Ripristina gli stati di espansione per ogni elemento filtrato
  //    */
  //   this.filteredData?.forEach((item, index) => {
  //     this.applyExpandedStates(item, expandedStates[index]);
  //   });
  // }

  // Modifica filterNodes:
  filterNodes() {
    if (!this.searchTerm) {
      this.filteredData = null;
      return;
    }

    const expandedStates = this.accordionData().map((item) =>
      this.collectExpandedStates(item)
    );

    this.filteredData = this.accordionData()
      .map((item) => this.deepFilter(item, this.searchTerm.toLowerCase()))
      .filter((item) => item !== null) as AccordionItem[];

    if (this.filteredData.length === 0) {
      this.filteredData = [
        {
          id: "no-results",
          title: "No results found",
          children: [],
        },
      ];
      return;
    }

    this.filteredData?.forEach((item, index) => {
      this.applyExpandedStates(item, expandedStates[index]);
    });
  }

  private collectExpandedStates(node: AccordionItem): Map<string, boolean> {
    const expandedMap = new Map<string, boolean>();
    this.traverseNodes(node, (n) => {
      if (n.id) {
        expandedMap.set(n.id, n?.isExpanded as boolean);
      }
    });
    return expandedMap;
  }

  private applyExpandedStates(
    node: AccordionItem,
    expandedStates: Map<string, boolean>
  ) {
    this.traverseNodes(node, (n) => {
      if (n.id && expandedStates.has(n.id)) {
        n.isExpanded = expandedStates.get(n.id);
      }
    });
  }

  private traverseNodes(
    node: AccordionItem,
    callback: (node: AccordionItem) => void
  ) {
    callback(node);
    if (node.children) {
      node.children?.forEach((child) => this.traverseNodes(child, callback));
    }
  }

  private deepFilter(
    node: AccordionItem,
    searchTerm: string
  ): AccordionItem | null {
    const nodeMatches = node.title.toLowerCase().includes(searchTerm);

    if (nodeMatches) {
      return JSON.parse(JSON.stringify(node));
    }

    if (!node.children || node.children.length === 0) {
      return null;
    }

    const filteredChildren = node.children
      .map((child) => this.deepFilter(child, searchTerm))
      .filter((child) => child !== null) as AccordionItem[];

    if (filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  isIntegrityHintHidden(): boolean {
    return !!this.searchTerm && this.filteredData !== null;
  }

  clearSearch() {
    this.searchTerm = "";
    this.filteredData = null;
  }

  onFiltersSidebarClosing() {
    this.shoFilterSidebar = false;
  }

  toggleFilters() {
    this.shoFilterSidebar = true;
  }
}
