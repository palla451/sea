import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { SharedModule } from "../../../shared/shared.module";
import { NavigationService } from "../../../core/services/navigation.service";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  fromDashboardCore,
  selectAllOpenIncidentForIncidentPage,
} from "../../../core/state";
import { IncidentOverviewTableComponent } from "../../dashboard/components/dashboard-components/incident-overview-table/incident-overview-table.component";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { SidebarService } from "../../dashboard/services/dashboard-sidebar.service";
import {
  assetActions,
  dashboardCoreActions,
} from "../../../core/state/actions";
import { shipFunctionsActions } from "../../dashboard/state/actions";

@Component({
  selector: "app-open-incidents-page",
  imports: [SharedModule, IncidentOverviewTableComponent],
  templateUrl: "./open-incidents-page.component.html",
  styleUrl: "./open-incidents-page.component.scss",
})
export class OpenIncidentsPageComponent implements OnInit, OnDestroy {
  sidebarService = inject(SidebarService);
  navigationService = inject(NavigationService);
  navigationManagerService = inject(NavigationManagerService);
  private readonly store = inject(Store);

  openIncidents = toSignal(
    this.store.select(selectAllOpenIncidentForIncidentPage),
    {
      initialValue: [],
    }
  );

  ngOnInit(): void {
    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.open_incidents_page
    );

    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.INCIDENTS);
    this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
    this.store.dispatch(assetActions.getAllAssetsList());
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());

    this.sidebarService.updateIncidentList(this.openIncidents());
  }

  ngOnDestroy(): void {
    this.sidebarService.leavingAnIncidentPage()
  }
}
