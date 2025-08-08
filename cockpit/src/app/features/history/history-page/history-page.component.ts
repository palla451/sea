import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { HistoryTableComponent } from "../components/history-table/history-table.component";
import { SharedModule } from "../../../shared/shared.module";
import { HistoryComponentsModule } from "../modules/history-components.module";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { HistorySidebarService } from "../services/history-sidebar.service";
import { Store } from "@ngrx/store";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import {
  fromDashboardCore,
  selectAllClosedIncidentForHistoryPage,
} from "../../../core/state";
import {
  dashboardCoreActions,
} from "../../../core/state/actions";
import { NavigationService } from "../../../core/services/navigation.service";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { SidebarService } from "../../dashboard/services/dashboard-sidebar.service";
import { shipFunctionsActions } from "../../dashboard/state/actions";
import { filter, noop, tap } from "rxjs";
import { Incident } from "../../dashboard/models/dashboard.models";
import { isNonNull } from "../../../core/utils/rxjs-operators/noNullOperator";

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

  historyIncidents = signal<Incident[]>([]);
  incidents = signal<Incident[]>([]);

  ngOnInit(): void {
    this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
    this.getAllIncidents();
    this.getAllClosedIncidents();

    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.history
    );
    
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.HISTORY);
  }

  ngOnDestroy(): void {
    this.dashboardSidebarService.leavingAnIncidentPage();
  }

  private getAllIncidents():void {
    this.store.select(fromDashboardCore.selectAllIncidentsList).pipe(
      filter(isNonNull),
      tap(allIncidents => {
          this.incidents.set(allIncidents);
          this.dashboardSidebarService.updateIncidentList(allIncidents);
      } )
    ).subscribe(noop);
  }

  private getAllClosedIncidents():void {
    this.store.select(selectAllClosedIncidentForHistoryPage).pipe(
      tap(allClosedIncidents => {
          this.historyIncidents.set(allClosedIncidents);
          this.sidebarService.updateIncidentList(allClosedIncidents);
      } )
    ).subscribe(noop);
  }
}
