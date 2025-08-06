import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { DashboardComponentsModule } from "../components/dashboard-components/dashboard-components.module";
import { CyberResilienceOverviewComponent } from "../../../core/components/cyber-resilience-overview/cyber-resilience-overview.component";
import { NavigationService } from "../../../core/services/navigation.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { CyberResilienceOVManagerService } from "../services/cyber-resilience-ovmanager.service";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import { SidebarService } from "../services/dashboard-sidebar.service";
import { Store } from "@ngrx/store";
import {
  fromDashboardCore,
  selectCompromisedAssetsCount,
  selectMaintenanceAssetsCount,
  selectOperationalAssetsCount,
  selectTurnedOffAssetsCount,
} from "../../../core/state";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { SharedModule } from "../../../shared/shared.module";
import { Incident } from "../models/dashboard.models";
import { noop, Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-dashboard-page",
  imports: [
    DashboardComponentsModule,
    CyberResilienceOverviewComponent,
    SharedModule,
  ],
  templateUrl: "./dashboard-page.component.html",
  styleUrl: "./dashboard-page.component.scss",
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  sidebarService = inject(SidebarService);
  navigationService = inject(NavigationService);
  navigationManagerService = inject(NavigationManagerService);
  cyberResilienceOVManager = inject(CyberResilienceOVManagerService);
  isCyberResilienceOVVisible = toSignal(
    this.navigationService.cyberResilienceOVSelected$
  );
  private readonly store = inject(Store);
  operationalCount = toSignal(this.store.select(selectOperationalAssetsCount), {
    initialValue: 0,
  });
  maintenanceCount = toSignal(this.store.select(selectMaintenanceAssetsCount));
  turnedOffCount = toSignal(this.store.select(selectTurnedOffAssetsCount));
  compromisedCount = toSignal(this.store.select(selectCompromisedAssetsCount));

  // incidents = toSignal(
  //   this.store.select(fromDashboardCore.selectAllIncidentsList),
  //   {
  //     initialValue: null,
  //   }
  // );

  incidents = signal<Incident[]>([]);
  //isLocalSpinnerRunning = signal<boolean>(true);

  getUpdatedIncidents(): void {
    this.store
      .select(fromDashboardCore.selectAllIncidentsList)
      .pipe(
        takeUntil(this.onDestroy$),
        tap((incidentList) => {
          if (incidentList) {
            this.incidents.set(incidentList);
            this.sidebarService.updateIncidentList(incidentList);
            //this.isLocalSpinnerRunning.set(false);
          }
        })
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
    this.getUpdatedIncidents();
    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.dashboard_page
    );
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.OVERVIEW);
  }

  ngOnDestroy(): void {
    this.sidebarService.leavingAnIncidentPage();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
