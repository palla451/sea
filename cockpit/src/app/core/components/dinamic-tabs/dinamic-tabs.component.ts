import {
  Component,
  Input,
  TemplateRef,
  inject,
  signal,
  effect,
  computed,
  OnInit,
} from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { SharedModule } from "../../../shared/shared.module";
import { IncidentEvent } from "../../../features/incident-detail/models/incident-detail.models";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import {
  fromIncidentDetail,
  selectAllCurrentIncidentEventsStatusIcon,
} from "../../state";
import { tap } from "rxjs";
import {
  calculateOperatingPercentageActions,
  shipFunctionsByAssetActions,
} from "../../state/actions";

export interface DinamicTab {
  value: number;
  title: string;
  context?: TabContext;
}
export interface TabContext {
  event: IncidentEvent;
  index: number;
}
@Component({
  selector: "app-dinamic-tabs",
  imports: [TabsModule, SharedModule],
  templateUrl: "./dinamic-tabs.component.html",
  styleUrl: "./dinamic-tabs.component.scss",
})
export class DinamicTabsComponent implements OnInit {
  private store = inject(Store);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  currentIncidentEventsStatuses = computed(() => {
    const currentSelectedIncidentEventsStatuses =
      this.allIncidents()[0]?.events.map((event) => event.status);
    return currentSelectedIncidentEventsStatuses;
  });

  currentStepperActiveEventIndex = toSignal(
    this.incidentManagementManagerService.currentStepperActiveEventIndex
  );

  currentIncidentIcons = signal<string[]>([]);

  dinamicTabs = signal<DinamicTab[]>([]);
  @Input() set tabs(tabs: DinamicTab[]) {
    this.dinamicTabs.set(tabs);
  }

  @Input() tabContentTemplate!: TemplateRef<{
    event: IncidentEvent;
    index: number;
  }>;

  get selectedTabIndex(): number {
    return this.currentStepperActiveEventIndex() as number;
  }

  currentInvolvedAssetIpAddress = computed<string>(() => {
    const currentInvolvedAssetIpAddress =
      this.allIncidents()[0]?.events[this.currentStepperActiveEventIndex() as number]
        ?.remediation?.actions[0]?.asset?.ipAddress;

    return currentInvolvedAssetIpAddress ?? "";
  });

  currentInvolvedAssetHostname = computed<string>(() => {
    const currentInvolvedAssetIpAddress =
      this.allIncidents()[0]?.events[this.currentStepperActiveEventIndex() as number]
        ?.remediation?.actions[0]?.asset?.hostName;

    return currentInvolvedAssetIpAddress ?? "";
  });

  setSelectedTabIndex(value: string | number) {
    this.incidentManagementManagerService.updateCurrentStepperActiveEventIndex(
      Number(value)
    );
    this.incidentManagementManagerService.updateIsMarkAsFalsePositiveRequired(
      false
    );

    this.store.dispatch(
      shipFunctionsByAssetActions.getAllShipFunctionsByAsset({
        remediationId:
          this.allIncidents()[0]?.events[
            this.currentStepperActiveEventIndex() as number
          ]?.remediation.id,
      })
    );

    const requestParameter =  this.currentInvolvedAssetIpAddress() ?? this.currentInvolvedAssetHostname();

    if (requestParameter && requestParameter !== "") {
        this.store.dispatch(
          calculateOperatingPercentageActions.getFunctionOperatingPercentage({
            assetIP: this.currentInvolvedAssetIpAddress() ?? '',
            hostName: this.currentInvolvedAssetHostname() ?? ''
          })
        );
    }
  }

  ngOnInit(): void {
    this.store
      .select(selectAllCurrentIncidentEventsStatusIcon)
      .pipe(
        tap((eventsIconSet) => {
          this.currentIncidentIcons.set(eventsIconSet);
        })
      )
      .subscribe();
  }

  getEventStatusIcon(currentEvent: IncidentEvent): string {
    return (
      this.incidentManagementManagerService.getEventStatusIcon(currentEvent) ??
      ""
    );
  }
}
