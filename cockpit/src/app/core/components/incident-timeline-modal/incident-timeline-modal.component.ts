import { Component, inject, OnInit } from "@angular/core";
import { TimelineModule } from "primeng/timeline";
import { AccordionModule } from "primeng/accordion";
import { SharedModule } from "../../../shared/shared.module";
import { SidebarAccordionComponent } from "../sidebar-accordion/sidebar-accordion.component";
import { TooltipModule } from "primeng/tooltip";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { IncidentDetailService } from "../../../features/incident-detail/services/incident-detail.service";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  fromIncidentDetail,
  selectEventsIncidentTimelineModal,
} from "../../state";

@Component({
  selector: "app-incident-timeline-modal",
  imports: [
    TimelineModule,
    AccordionModule,
    SharedModule,
    SidebarAccordionComponent,
    TooltipModule,
  ],
  templateUrl: "./incident-timeline-modal.component.html",
  styleUrl: "./incident-timeline-modal.component.scss",
})
export class IncidentTimelineModalComponent implements OnInit {
  timelineIncidentsService = inject(IncidentDetailService);
  private readonly store = inject(Store);
  isAccordionOpen: boolean = true;

  timelineModalEvents = toSignal(
    this.store.select(selectEventsIncidentTimelineModal),
    {
      initialValue: [],
    }
  );

  expandedIndex: number | null = null;
  tooltipVisible: string | null = null;
  tooltipsMap: Record<string, string> = {
    ipAddress: "genericTootltipInfo.ipAddress",
    assetRole: "genericTootltipInfo.assetRole",
  };
  //TODO: sentire backend per property delle info tooltip, store per le api

  private modalOpenSubscription!: Subscription;

  constructor() {}

  ngOnInit(): void {}

  noSort = () => 0;

  getTooltip(key: unknown): string | undefined {
    if (typeof key === "string") {
      return this.tooltipsMap[key];
    }
    return undefined;
  }
}
