import { Component, inject } from "@angular/core";
import { TimelineModule } from "primeng/timeline";
import { SharedModule } from "../../../shared/shared.module";
import { NavigationService } from "../../services/navigation.service";
import {
  IncidentDetailAsset,
  IncidentTimelineEvents,
} from "../../../features/incident-detail/models/incident-detail.models";
import { BaseReadonlyModalComponent } from "../base-readonly-modal/base-readonly-modal.component";
import { IncidentTimelineModalComponent } from "../incident-timeline-modal/incident-timeline-modal.component";
import { Store } from "@ngrx/store";
import {
  selectAllAssetsInvolved,
  selectEventsIncidentTimeline,
} from "../../state";
import { toSignal } from "@angular/core/rxjs-interop";
import { IncidentDetailManagerService } from "../../../features/incident-detail/services/incident-detail-manager.service";

@Component({
  selector: "app-incident-timeline",
  imports: [
    TimelineModule,
    SharedModule,
    BaseReadonlyModalComponent,
    IncidentTimelineModalComponent,
  ],
  templateUrl: "./incident-timeline.component.html",
  styleUrl: "./incident-timeline.component.scss",
})
export class IncidentTimelineComponent {
  navigationManagerService = inject(NavigationService);
  private readonly store = inject(Store);
  private incidentDetailManagerService = inject(IncidentDetailManagerService);
  incidentAccordionOpened = toSignal(
    this.incidentDetailManagerService.incidentAccordionOpened,
    {
      initialValue: true,
    }
  );
  isDetailsModalOpened = false;

  timelineEvents: () => IncidentTimelineEvents[] = toSignal(
    this.store.select(selectEventsIncidentTimeline),
    {
      initialValue: [],
    }
  );

  assetsInvolvedInEvent: () => IncidentDetailAsset[] = toSignal(
    this.store.select(selectAllAssetsInvolved),
    {
      initialValue: [],
    }
  );

  getAssetInvolvedDescription(timelineEvent: IncidentTimelineEvents): string {
    return this.assetsInvolvedInEvent()
      .filter((assetInvolved) => assetInvolved.id === timelineEvent.assetId)
      .map((item) => item.description)
      .join(", ");
  }

  toggleFullTimeline(): void {
    this.isDetailsModalOpened = true;
  }

  manageModalClosedState(): void {
    this.isDetailsModalOpened = false;
  }

  getDinamicCOntainerHeight(): string {
    return this.incidentAccordionOpened()
      ? "accordionExpandedHeight"
      : "accordionCollapsedHeight";
  }
}
