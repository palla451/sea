import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import {
  Action,
  IncidentDetail,
  IncidentEvent,
} from "../../../features/incident-detail/models/incident-detail.models";
import { DinamicTabsComponent } from "../dinamic-tabs/dinamic-tabs.component";
import { SharedModule } from "../../../shared/shared.module";
import { StepperComponent } from "../stepper/stepper.component";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";
import {
  AccordionItem,
  mapFunctionNodesToAccordionItems,
} from "../../models/tree-view.models";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import {
  fromCyberResilience,
  selectAllVesselMacroFunctions,
  selectFunctionIdsGroupedByMacroFunction,
} from "../../../features/dashboard/state";
import { CyberResilienceSidebarService } from "../../../features/dashboard/services/cyber-resilience-sidebar.service";
import {
  calculateOperatingPercentageActions,
  shipFunctionsByAssetActions,
} from "../../state/actions";
import {
  calculateOperatingPercentageFeature,
  fromIncidentDetail,
  getAllShipFunctsByAssetFeature,
} from "../../state";
import { map, noop, tap } from "rxjs";
import { RemediationImpactService } from "../../services/remediation-impact.service";
import { CurrentStepAsset } from "../../models/remediation-impact.model";
import { ReliabilityBarComponent } from "../reliability-bar/reliability-bar.component";
import { ManageIncidentStatesEnum } from "../../enums/manage-incident-states.enum";
@Component({
  selector: "app-incident-management-modal",
  imports: [
    DinamicTabsComponent,
    SharedModule,
    StepperComponent,
    TreeViewNodeComponent,
    ReliabilityBarComponent,
  ],
  templateUrl: "./incident-management-modal.component.html",
  styleUrl: "./incident-management-modal.component.scss",
})
export class IncidentManagementModalComponent implements OnInit {
  cyberResilienceOVManager = inject(CyberResilienceOVManagerService);
  @ViewChild("btnMarkAsFalsePositive", { static: false })
  buttonMarkAsFalsePositiveRef!: ElementRef<HTMLButtonElement>;
  private store = inject(Store);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  currentStepperActiveEventIndex = toSignal(
    this.incidentManagementManagerService.currentStepperActiveEventIndex
  );

  currentSelectedIncident = toSignal(
    this.store
      .select(fromIncidentDetail.selectIncidentDetailBundle)
      .pipe(map((selectIncidentDetailBundle) => selectIncidentDetailBundle[0]))
  );

  get currentStepperActiveEvent() {
    return this.currentStepperActiveEventIndex();
  }

  isMarkAsFalsePositiveRequired = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveRequired,
    {
      initialValue: false,
    }
  );

  isCurrEventMarkedAsFalsePositive = computed<boolean>(() => {
    const isEventMarkedAsFalsePositive =
      this.allIncidents()[0]?.events[
        this.currentStepperSelectedEvent()
      ]?.status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED;
    return isEventMarkedAsFalsePositive;
  });

  isCurrentEventJustManaged = computed<boolean>(() => {
    const isCurrentEventJustManaged = this.allIncidents()[0]?.events[
      this.currentStepperSelectedEvent()
    ]?.remediation?.actions?.some(
      (action) =>
        action.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_COMPLETED ||
        action.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_ROLLBACKED ||
        action.status.toLowerCase() ===
          ManageIncidentStatesEnum.ACTION_PENDING ||
        action.status.toLowerCase() === ManageIncidentStatesEnum.ACTION_WRONG
    );
    return isCurrentEventJustManaged;
  });

  isBtnMarkAsFalsePositiveClickable = computed(() => {
    let returningStyle = { cursor: "pointer" };
    if (
      this.isMarkAsFalsePositiveRequired() ||
      this.isCurrEventMarkedAsFalsePositive() ||
      this.isCurrentEventJustManaged()
    ) {
      returningStyle = { cursor: "default" };
    }

    return returningStyle;
  });

  isMarkAsFalsePositiveAccepted = toSignal(
    this.incidentManagementManagerService.isMarkAsFalsePositiveAccepted,
    {
      initialValue: false,
    }
  );

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  currentStepperSelectedEvent = toSignal(
    this.incidentManagementManagerService.currentStepperActiveEventIndex,
    {
      initialValue: -1,
    }
  );

  isCurrentlySelectedEventMarkedAsFalsePositive = computed(() => {
    const currentlySelectedEvent =
      this.incidentManagementManagerService._currentStepperActiveEventIndex
        .value;

    const currentlySelectedEventMarkedAsFalsePositive =
      this.currentStepperSelectedEvent() !== -1 &&
      this.allIncidents()[0].events[
        currentlySelectedEvent
      ].status.toLowerCase() === ManageIncidentStatesEnum.EVENT_REJECTED;

    if (currentlySelectedEventMarkedAsFalsePositive) {
      this.incidentManagementManagerService.updateIsMarkAsFalsePositiveAccepted(
        false
      );
    }

    return currentlySelectedEventMarkedAsFalsePositive;
  });

  selectedTabIndex = signal<number>(0);
  selectedActionIndex = signal<number>(0);
  falsePositiveMode = signal<boolean>(false);
  currentIncidentIdSignal = signal<number>(0);

  searchTerm = "";
  private sidebarService = inject(CyberResilienceSidebarService);
  private remediationImpactService = inject(RemediationImpactService);
  crOverviewManager = inject(CyberResilienceOVManagerService);
  filteredData: AccordionItem[] | null = null;
  cyberResilienceFunctionality = toSignal(
    this.crOverviewManager.selectedCyberResiliencePerformance$,
    { initialValue: null }
  );

  /**
   * retrieve ship functions for asset involved signal
   */
  shipFunctionsForAssetInvolved = toSignal(
    this.store.select(
      getAllShipFunctsByAssetFeature.selectShipFunctionsByAsset
    ),
    {
      initialValue: [],
    }
  );

  uniqueFunctionNames = computed<string[]>(() => {
    const functions = this.shipFunctionsForAssetInvolved().map(
      (item) => item.function
    );

    return [...new Set(functions)]; // Rimuove i duplicati
  });

  shipFunctions = toSignal(
    this.store.select(fromCyberResilience.selectShipFunctions),
    {
      initialValue: [],
    }
  );

  /**
   * calculate operating percentage signal
   */
  calculateOperatingPercentageSignal = toSignal(
    this.store.select(
      calculateOperatingPercentageFeature.selectCurrentStepAsset
    ),
    {
      initialValue: null,
    }
  );

  uniqueParentIds = computed<number[]>(() => {
    let allParentIds;
    if (this.calculateOperatingPercentageSignal()) {
      allParentIds =
        (
          this.calculateOperatingPercentageSignal() as CurrentStepAsset[]
        )[0]?.functions
          ?.map((func) => func.parent?.id)
          .filter((id): id is number => id !== undefined && id !== null) || [];
    }

    return [...new Set(allParentIds)];
  });

  currentEventImpactedAssetPiecemark = computed<string>(() => {
    let currentEventImpactedAssetPiecemark;
    currentEventImpactedAssetPiecemark =
      this.allIncidents()[0]?.events[this.currentStepperSelectedEvent()]
        .remediation?.actions[0]?.asset?.pieceMark;

    return currentEventImpactedAssetPiecemark;
  });

  getAccordionData(macroFunctionName: string): AccordionItem[] {
    const returningData: AccordionItem[] = (
      mapFunctionNodesToAccordionItems(this.shipFunctions() ?? []).filter(
        (macroFunctions) => macroFunctions?.title === macroFunctionName
      )[0]?.children || []
    ).filter((childFunc) =>
      this.uniqueFunctionNames().some(
        (uniqueFunctionName) => uniqueFunctionName === childFunc?.title
      )
    ) as AccordionItem[];

    this.sidebarService.updateShipFunctionsList(returningData);
    const dataFilteredByCompromisedAssets = returningData.map((data) => {
      const filteredDataByCompromisedAsstes: AccordionItem = {
        ...data,
        children: data.children
          ?.filter((child) => child.assetState?.toLowerCase() === "compromised")
          .filter(
            (asset) => asset?.id === this.currentEventImpactedAssetPiecemark()
          ),
      };

      return filteredDataByCompromisedAsstes;
    });

    return dataFilteredByCompromisedAssets;
  }

  incidentEvents = computed<IncidentEvent[]>(() => {
    let returningIncidentEvents;
    if(this.allIncidents()){
      const currentlySelectedIncident = this.allIncidents()[0];
      returningIncidentEvents = currentlySelectedIncident?.events;
    }

    return returningIncidentEvents ?? [];
  });


  eventTabs = computed<{ value: number; title: string; context: any }[]>(() => {
    let returningEventTabs;
    if(this.incidentEvents()){
      returningEventTabs =  
      this.incidentEvents().map((event, i) => ({
        value: i,
        title: `Event ${i + 1}`,
        context: { event, index: i },
      })
    );
    }

    return returningEventTabs ?? [];
  });

  remediationImpactModalOpened = toSignal(
    this.incidentManagementManagerService.isRemediationImpactModalOpen,
    {
      initialValue: false,
    }
  );
  impactedAsset = signal<string>("");

  activeStepperStartingActionIndex = toSignal(
    this.incidentManagementManagerService.currentStepperActiveActionIndex,
    {
      initialValue: -1,
    }
  );

  functionIdsByMacroFunction = toSignal(
    this.store.select(selectFunctionIdsGroupedByMacroFunction),
    {
      initialValue: null,
    }
  );

  impactedFunctionIdsByMacroFunction = computed<
    {
      macroFunctionId: number;
      macroFunctionName: string;
      functionIds: number[];
    }[]
  >(() => {
    const filteredFuncGroups = this.functionIdsByMacroFunction()?.filter(
      (funcGroup) =>
        this.uniqueParentIds().some(
          (parentId) => parentId === funcGroup.macroFunctionId
        )
    );

    console.log(
      "filteredFuncGroupslog",
      filteredFuncGroups,
      this.uniqueParentIds(),
      this.functionIdsByMacroFunction()
    );
    return [...new Set(filteredFuncGroups)];
  });

  currentInvolvedAssetIpAddress = computed<string>(() => {
    const currentInvolvedAssetIpAddress =
      this.allIncidents()[0]?.events[this.currentStepperSelectedEvent()]
        ?.remediation?.actions[0]?.asset?.ipAddress;

    return currentInvolvedAssetIpAddress ?? "";
  });

  currentInvolvedAssetHostname = computed<string>(() => {
    const currentInvolvedAssetIpAddress =
      this.allIncidents()[0]?.events[this.currentStepperSelectedEvent()]
        ?.remediation?.actions[0]?.asset?.hostName;

    return currentInvolvedAssetIpAddress ?? "";
  });

  shipMacroFunctions = toSignal(
    this.store.select(selectAllVesselMacroFunctions),
    {
      initialValue: [],
    }
  );

  manageCurrentlySelectedIncidentEventsSet(): void {
     if (this.incidentEvents()) {

        this.incidentManagementManagerService.updateCurrentStepperEventSelected(
          this.incidentEvents()[0]?.description
        );

        this.store.dispatch(
          shipFunctionsByAssetActions.getAllShipFunctionsByAsset({
            remediationId: this.incidentEvents()[0]?.remediation.id,
          })
        );
      }

      const requestParameter =
        this.currentInvolvedAssetIpAddress() ??
        this.currentInvolvedAssetHostname();

      if (requestParameter && requestParameter !== "") {
        this.store.dispatch(
          calculateOperatingPercentageActions.getFunctionOperatingPercentage({
            assetIP:  this.currentInvolvedAssetIpAddress() ?? '',
            hostName: this.currentInvolvedAssetHostname() ?? ''
          })
        );
      }
  }

  checkIfMarkAsFalsePositiveBtnIsActive(): void {
    if (
      this.isCurrentlySelectedEventMarkedAsFalsePositive() ||
      this.isMarkAsFalsePositiveAccepted()
    ) {
      this.buttonMarkAsFalsePositiveRef.nativeElement.disabled = true;
      this.buttonMarkAsFalsePositiveRef.nativeElement.style.cursor = "default";
    } else {
      this.buttonMarkAsFalsePositiveRef.nativeElement.disabled = false;
      this.buttonMarkAsFalsePositiveRef.nativeElement.style.cursor = "pointer";
    }
  }

  constructor() {
    this.incidentManagementManagerService.updateCurrentStepperActiveEventIndex(
      0
    );

    effect(() => {
      if (
        this.currentSelectedIncident() &&
        this.currentStepperActiveEventIndex() !== -1
      ) {
        this.incidentManagementManagerService.setStepperToInitialState(
          this.currentSelectedIncident() as IncidentDetail
        );
      }

      //todo - controllare che avvenga il passaggio dei tab correnti correttamente
      if (this.isMarkAsFalsePositiveAccepted()) {
        this.checkIfMarkAsFalsePositiveBtnIsActive();
      }
      // if(!this.isMarkAsFalsePositiveRequired()) {
      //   this.buttonMarkAsFalsePositiveRef.nativeElement.disabled = false;
      //   this.buttonMarkAsFalsePositiveRef.nativeElement.style.cursor = 'pointer';
      // }
    });
  }

  ngOnInit(): void {
    //this.incidentManagementManagerService.updateCurrentStepperActiveEventIndex(0);
    this.incidentManagementManagerService.updateIsIncidentManagementModalOpen(
      true
    );

    this.store
      .select(getAllShipFunctsByAssetFeature.selectShipFunctionsByAsset)
      .pipe(
        tap((shipFunctionsByAsset) => {
          this.impactedAsset.set(shipFunctionsByAsset[0]?.pieceMark);
          if (this.impactedAsset() && this.impactedAsset() !== "") {
            // this.filterNodes();
          }
        })
      )
      .subscribe(noop);
  }

  calculateOperatingPercentageByRiskEngine(macrofunctionId: number): number {
    let macrofuncImpactedChild;

    if (this.calculateOperatingPercentageSignal()) {
      macrofuncImpactedChild = (
        this.calculateOperatingPercentageSignal() as CurrentStepAsset[]
      )[0]?.functions.find(
        (subFunc) => subFunc?.parent?.id === macrofunctionId
      );
    }

    return macrofuncImpactedChild
      ? macrofuncImpactedChild?.operatingPercentage
      : 0;
  }

  calculateMacrofuncTrendingPercentage(macrofunctionId: number): number {
    let macrofuncImpactedChild;

    if (this.shipFunctions()) {
      macrofuncImpactedChild = this.shipFunctions().find(
        (macroFunc) => macroFunc?.id === macrofunctionId
      );
    }

    return macrofuncImpactedChild &&
      this.calculateOperatingPercentageByRiskEngine(macrofunctionId)
      ? macrofuncImpactedChild["operatingPercentage"] -
          this.calculateOperatingPercentageByRiskEngine(macrofunctionId)
      : 0;
  }

  calculateCyberResiliencePercentageByMacrofunc(
    macrofunctionId: number
  ): number {
    let macrofuncOVPercentage;

    if (this.shipMacroFunctions()) {
      macrofuncOVPercentage = this.shipMacroFunctions().find(
        (macrofunc) => macrofunc?.id === macrofunctionId
      )?.["operatingPercentage"] as number;
    }

    return macrofuncOVPercentage ? macrofuncOVPercentage : 0;
  }

  checkIfAccordionItemIsInCurrentMacroFunction(
    accordionitem: AccordionItem,
    macrofunctionIds: Number[]
  ): boolean {
    return macrofunctionIds.some((id) => id === Number(accordionitem.id));
  }

  filterAccordionItems(
    items: AccordionItem[] | null,
    searchTitle: string
  ): AccordionItem[] {
    return (items || []).reduce(
      (filtered: AccordionItem[], item: AccordionItem) => {
        // Se l'elemento non ha children e il titolo corrisponde, lo includiamo
        if (!item.children && item.id === searchTitle) {
          filtered.push({ ...item });
          return filtered;
        }

        // Se l'elemento ha children, filtriamo i children
        if (item.children) {
          const filteredChildren = this.filterAccordionItems(
            item.children,
            searchTitle
          );

          // Se ci sono children che corrispondono, creiamo una copia dell'item con solo i children filtrati
          if (filteredChildren.length > 0) {
            filtered.push({
              ...item,
              children: filteredChildren,
              isExpanded: true, // Espandiamo l'item per mostrare i children filtrati
            });
          }
        }

        return filtered;
      },
      []
    );
  }

  private isFalsePositiveEvent(event: IncidentEvent | null): boolean {
    return event?.status?.toLowerCase() === "rejected";
  }

  get currentEvent(): IncidentEvent | null {
    const eventsArray = this.incidentEvents();
    return eventsArray.length ? eventsArray[this.selectedTabIndex()] : null;
  }

  get currentActions(): Action[] {
    return this.currentEvent?.remediation?.actions || [];
  }

  onTabChanged(index: number) {
    this.selectedTabIndex.set(index);
    this.selectedActionIndex.set(0);

    this.incidentManagementManagerService.updateCurrentStepperEventSelected(
      this.incidentEvents()[index]?.description
    );

    const event = this.incidentEvents()[index];

    const isFalsePositive = this.isFalsePositiveEvent(event);

    if (isFalsePositive) {
      this.falsePositiveMode.set(true);
    } else {
      this.falsePositiveMode.set(false);
    }
  }

  enableFalsePositiveMode() {
    this.buttonMarkAsFalsePositiveRef.nativeElement.disabled = true;
    this.buttonMarkAsFalsePositiveRef.nativeElement.style.cursor = "default";
    //this.falsePositiveMode.set(true);
    this.incidentManagementManagerService.updateIsMarkAsFalsePositiveRequired(
      true
    );
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
}
