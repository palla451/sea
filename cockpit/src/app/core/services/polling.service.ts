import { inject, Injectable, OnDestroy } from "@angular/core";
import {
  merge,
  of,
  Subject,
  Subscription,
  timer,
} from "rxjs";
import {
  debounceTime,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Store } from "@ngrx/store";
import { assetActions, dashboardCoreActions } from "../state/actions";
import { shipFunctionsActions } from "../../features/dashboard/state/actions";
import { SidebarService } from "../../features/dashboard/services/dashboard-sidebar.service";
import { AssetSidebarService } from "../../features/asset-management/services/asset-sidebar.service";
import { HistorySidebarService } from "../../features/history/services/history-sidebar.service";
import { CyberResilienceSidebarService } from "../../features/dashboard/services/cyber-resilience-sidebar.service";
import { IncidentManagementManagerService } from "./incident-management-manager.service";
@Injectable({
  providedIn: "root",
})
export class PollingService implements OnDestroy {
  private pollingSubscription: Subscription | null = null;
  private readonly store = inject(Store);
  private sidebarService = inject(SidebarService);
  private assetSidebarService = inject(AssetSidebarService);
  private historySidebarService = inject(HistorySidebarService);
  private cyberResilienceSidebarService = inject(CyberResilienceSidebarService);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  private destroy$ = new Subject<void>();
  private stopPolling$ = new Subject<void>();
  private startPolling$ = new Subject<void>();
  private isPollingActive = false;

  private pollingCallbacks = new Map<string, () => void>();

  registerPollingCallback(id: string, callback: () => void): void {
    this.pollingCallbacks.set(id, callback);
  }

  unregisterPollingCallback(id: string): void {
    this.pollingCallbacks.delete(id);
  }

  getRegisteredActionIds(): string[] {
    const actionIdRegex = /Action(\w+)$/;

    return Array.from(this.pollingCallbacks.keys())
      .map((key) => {
        const match = key.match(actionIdRegex);
        return match ? match[1] : null;
      })
      .filter((id): id is string => id !== null);
  }

  setupPollingControl(): void {
    merge(
      this.sidebarService.appliedFiltersAmountSubject,
      this.assetSidebarService.appliedFiltersAmountSubject,
      this.historySidebarService.appliedFiltersAmountSubject,
      this.cyberResilienceSidebarService.appliedFiltersAmountSubject,
      this.incidentManagementManagerService.isBaseReadOnlyModalOpen
    )
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.checkStatus());
  }

  private checkStatus(): void {
    const shouldStop =
      this.sidebarService._appliedFiltersAmountSubject.value > 0 ||
      this.assetSidebarService._appliedFiltersAmountSubject.value > 0 ||
      this.historySidebarService._appliedFiltersAmountSubject.value > 0 ||
      this.cyberResilienceSidebarService._appliedFiltersAmountSubject.value >
        0 ||
      this.incidentManagementManagerService._isBaseReadOnlyModalOpen.value;

    const shouldStart =
      this.sidebarService._appliedFiltersAmountSubject.value === 0 &&
      this.assetSidebarService._appliedFiltersAmountSubject.value === 0 &&
      this.historySidebarService._appliedFiltersAmountSubject.value === 0 &&
      this.cyberResilienceSidebarService._appliedFiltersAmountSubject.value ===
        0 &&
      !this.incidentManagementManagerService._isBaseReadOnlyModalOpen.value;
    if (shouldStop) {
      this.stopPolling();
    } else if (shouldStart) {
      this.startPolling();
    }
  }

  startPolling(): void {
    if (this.isPollingActive) return;

    this.isPollingActive = true;
    this.stopPolling$.next();

    // this.pollingSubscription = interval(45000)
    //   .pipe(
    //     startWith(0),
    //     tap(() => {
    //       console.log(
    //         `[Polling] Esecuzione polling a ${new Date().toISOString()}`
    //       );
    //       this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
    //       this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
    //       this.store.dispatch(assetActions.getAllAssetsList());

    //       for (const [id, callback] of this.pollingCallbacks.entries()) {
    //         try {
    //           callback();
    //         } catch (error) {
    //           console.error(`Errore nella callback di polling "${id}"`, error);
    //         }
    //       }
    //     }),
    //     takeUntil(this.stopPolling$),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe();

    this.pollingSubscription = timer(0, 45000)
      .pipe(
        tap(() =>
          console.log(
            `[Polling] Esecuzione polling a ${new Date().toISOString()}`
          )
        ),
        switchMap(() => {
          this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
          this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
          this.store.dispatch(assetActions.getAllAssetsList());

          return of(null).pipe(
            tap(() => {
              for (const [id, callback] of this.pollingCallbacks.entries()) {
                try {
                  callback();
                } catch (error) {
                  console.error(
                    `Errore nella callback di polling "${id}"`,
                    error
                  );
                }
              }
            })
          );
        }),
        takeUntil(this.stopPolling$),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  stopPolling(): void {
    this.stopPolling$.next();
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
    this.isPollingActive = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopPolling();
  }

  executePollingNow(): void {
    console.log(
      `[Polling] Esecuzione polling immediata a ${new Date().toISOString()}`
    );
    this.store.dispatch(dashboardCoreActions.getAllIncidentsList());
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
    this.store.dispatch(assetActions.getAllAssetsList());

    for (const [id, callback] of this.pollingCallbacks.entries()) {
      try {
        callback();
      } catch (error) {
        console.error(`Errore nella callback di polling "${id}"`, error);
      }
    }
  }
}
