import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { HistoryTableComponent } from "../components/history-table/history-table.component";
import { SharedModule } from "../../../shared/shared.module";
import { HistoryComponentsModule } from "../modules/history-components.module";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { HistorySidebarService } from "../services/history-sidebar.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import {
  fromDashboardCore,
  selectAllClosedIncidentForHistoryPage,
} from "../../../core/state";
import {
  assetActions,
  dashboardCoreActions,
  incidentDetailActions,
} from "../../../core/state/actions";
import { NavigationService } from "../../../core/services/navigation.service";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { SidebarService } from "../../dashboard/services/dashboard-sidebar.service";
import { shipFunctionsActions } from "../../dashboard/state/actions";

@Component({
  selector: "app-history-page",
  imports: [SharedModule, HistoryTableComponent, HistoryComponentsModule],
  templateUrl: "./history-page.component.html",
  styleUrl: "./history-page.component.scss",
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  navigationManagerService = inject(NavigationManagerService);
  dashboardSidebarService = inject(SidebarService);
  sidebarService = inject(HistorySidebarService);
  navigationService = inject(NavigationService);

  historyIncidents = toSignal(
    this.store.select(selectAllClosedIncidentForHistoryPage),
    {
      initialValue: [],
    }
  );

  incidents = toSignal(
    this.store.select(fromDashboardCore.selectAllIncidentsList),
    {
      initialValue: [],
    }
  );

  ngOnInit(): void {
    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.history
    );

    this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
    this.store.dispatch(assetActions.getAllAssetsList());
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());

    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.HISTORY);

    this.sidebarService.updateIncidentList(this.historyIncidents());
    this.dashboardSidebarService.updateIncidentList(this.incidents());
  }

  ngOnDestroy(): void {
    this.dashboardSidebarService.leavingAnIncidentPage();
  }
}
