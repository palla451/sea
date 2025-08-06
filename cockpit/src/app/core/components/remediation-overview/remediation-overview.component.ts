import { Component, Inject, inject } from "@angular/core";
import { TimelineModule } from "primeng/timeline";
import { SharedModule } from "../../../shared/shared.module";
import { SidebarAccordionComponent } from "../sidebar-accordion/sidebar-accordion.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { IconActionPathMap } from "../../models/iconDictionary.model";
import { IncidentEvent } from "../../../features/incident-detail/models/incident-detail.models";
import { BaseReadonlyModalComponent } from "../base-readonly-modal/base-readonly-modal.component";
import { IncidentManagementModalComponent } from "../incident-management-modal/incident-management-modal.component";
import { selectAllActionDescriptions, selectEvents } from "../../state";
import { IncidentManageButtonComponent } from "../incident-manage-button/incident-manage-button.component";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { hasPrivilegedAccess } from "../../../auth/state";

@Component({
  selector: "app-remediation-overview",
  imports: [
    TimelineModule,
    SharedModule,
    SidebarAccordionComponent,
    BaseReadonlyModalComponent,
    IncidentManagementModalComponent,
    IncidentManageButtonComponent,
  ],
  templateUrl: "./remediation-overview.component.html",
  styleUrl: "./remediation-overview.component.scss",
})
export class RemediationOverviewComponent {
  activatedRoute = inject(ActivatedRoute);

  paramId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get("id") ?? ""))
  );

  get currentIncidentId() {
    return Number(this.paramId());
  }

  expandedIndex: number | null = null;
  iconActionMap = IconActionPathMap;
  store = inject(Store);
  hasPrivilegedAccess$ = this.store.select(hasPrivilegedAccess);

  events = toSignal(this.store.select(selectEvents), {
    initialValue: [],
  });
  selectedIncident: IncidentEvent[] | null = null;
  isIncidentModalOpened: boolean = false;

  onManageIncident(incident: IncidentEvent[]) {
    this.selectedIncident = incident;
    this.isIncidentModalOpened = true;
  }

  manageModalClosedState() {
    this.isIncidentModalOpened = false;
    this.selectedIncident = null;
  }

  actions = toSignal(this.store.select(selectAllActionDescriptions), {
    initialValue: [],
  });

  onManageActionCallback = () => {
    this.onManageIncident(this.events());
  };
}
