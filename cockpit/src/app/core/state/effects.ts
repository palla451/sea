import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TranslocoService } from "@jsverse/transloco";
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import {
  assetActions,
  calculateOperatingPercentageActions,
  dashboardCoreActions,
  incidentDetailActions,
  IncidentManagementActions,
  markEventFalsePositiveActions,
  messageActions,
  shipFunctionsByAssetActions,
} from "./actions";
import * as uuid from "uuid";
import { IncidentDetailService } from "../../features/incident-detail/services/incident-detail.service";
import { DashboardService } from "../../features/dashboard/services/dashboard.service";
import { AssetManagementService } from "../../features/asset-management/services/asset-management.service";
import { IncidentManagementModalService } from "../services/incident-management-modal.service";
import { RemediationImpactService } from "../services/remediation-impact.service";
import { MarkEventAsFalsePositiveService } from "../services/mark-event-as-false-positive.service";
import { IncidentManagementManagerService } from "../services/incident-management-manager.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromIncidentDetail } from ".";
import { Store } from "@ngrx/store";
import { sanitizeErrorMessage } from "../utils/string-functions";

@Injectable()
export class IncidentDetailEffects {
  private readonly actions$ = inject(Actions);
  private readonly incidentDetailService = inject(IncidentDetailService);
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET DEGLI INCIDENTS

  getAllIncidentDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentDetailActions.getAllIncidentDetail),
      switchMap((action) =>
        this.incidentDetailService.getIncidentDetail(action.incidentId).pipe(
          map((response) => {
            if (response) {
              return incidentDetailActions.getAllIncidentDetailSuccess({
                incidentDetailBundle: response,
              });
            } else {
              return incidentDetailActions.errorGetAllIncidentDetail({
                error: this.transloco.translate("error"),
              });
            }
          }),
          catchError((error) =>
            of(
              incidentDetailActions.errorGetAllIncidentDetail({
                error: error.message || this.transloco.translate("error"),
              })
            )
          )
        )
      )
    );
  });

  getIncidentDetailError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentDetailActions.errorGetAllIncidentDetail),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });
}

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly transloco = inject(TranslocoService);
  private readonly getDashboardCoreService = inject(DashboardService);

  /**
   * EFFECTS RELATIVI ALLA INCIDENT DETAIL
   */

  getAllIncidentsList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dashboardCoreActions.getAllIncidentsList),
      switchMap(() =>
        this.getDashboardCoreService.getRetrieveIncident().pipe(
          map((response) => {
            if (response) {
              return dashboardCoreActions.getAllIncidentsListSuccess({
                allIncidentsList: response,
              });
            } else {
              return dashboardCoreActions.errorGetAllIncidentsList({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              dashboardCoreActions.errorGetAllIncidentsList({
                error: sanitizeErrorMessage(
                  error.message || this.transloco.translate("error")
                ),
              })
            )
          )
        )
      )
    );
  });

  getAllIncidentsListError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dashboardCoreActions.errorGetAllIncidentsList),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });
}

@Injectable()
export class AssetManagementEffects {
  private readonly actions$ = inject(Actions);
  private readonly assetManagementService = inject(AssetManagementService);
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET DEGLI ASSET

  getAllAssetsList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.getAllAssetsList),
      switchMap(() =>
        this.assetManagementService.getAssets().pipe(
          map((response) => {
            if (response) {
              return assetActions.getAllAssetsListSuccess({
                allAssetsList: response,
              });
            } else {
              return assetActions.errorGetAllAssetsList({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              assetActions.errorGetAllAssetsList({
                error:
                  sanitizeErrorMessage(error.message) ||
                  this.transloco.translate("error"),
              })
            )
          )
        )
      )
    );
  });

  // getAllAssetsListSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(assetActions.getAllAssetsListSuccess),
  //     switchMap(() =>
  //       this.transloco.selectTranslate("alerts.alerts.successfullOperation").pipe(
  //         map(() =>
  //           messageActions.setMessage({
  //             message: {
  //               id: uuid.v4(),
  //               summary: this.transloco.translate("alerts.successfullOperation"),
  //               detail: this.transloco.translate("alerts.successfullOperation"),
  //               severity: "success",
  //               life: 13000,
  //             },
  //           })
  //         )
  //       )
  //     )
  //   );
  // });

  getAllAssetsListError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.errorGetAllAssetsList),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });

  // EFFECTS RELATIVI ALLA PATCH DEGLI ASSET

  patchAsset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.patchAsset),
      switchMap((action) =>
        this.assetManagementService.patchAsset(action.newAssetState).pipe(
          map((response) => {
            if (response) {
              return assetActions.patchAssetSuccess();
            } else {
              return assetActions.errorPatchAsset({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              assetActions.errorPatchAsset({
                error:
                  sanitizeErrorMessage(error.message) ||
                  sanitizeErrorMessage(this.transloco.translate("error")),
              })
            )
          )
        )
      )
    );
  });

  patchAssetSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.patchAssetSuccess),
      switchMap(() =>
        this.transloco.selectTranslate("alerts.successfullOperation").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate(
                  "alerts.successfullOperation"
                ),
                detail: this.transloco.translate("alerts.successfullOperation"),
                severity: "success",
                life: 13000,
              },
            })
          )
        )
      )
    );
  });

  patchAssetError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.errorPatchAsset),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });

  reloadAssets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(assetActions.patchAssetSuccess),
      switchMap(() =>
        this.transloco
          .selectTranslate("alerts.successfullOperation")
          .pipe(map(() => assetActions.getAllAssetsList()))
      )
    );
  });
}

@Injectable()
export class IncidentManagementModalEffects {
  private store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly transloco = inject(TranslocoService);
  private readonly incidentManagementModalService = inject(
    IncidentManagementModalService
  );
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );
  allIncidents = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  updateIncidentManagementAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncidentManagementActions.updateIncidentManagementActions),
      exhaustMap((action) =>
        this.incidentManagementModalService
          .actionManage(action.actionStep)
          .pipe(
            map((response) => {
              if (response) {
                return IncidentManagementActions.updateIncidentManagementActionsSuccess(
                  {
                    actions: response.actions,
                    incidentId: response.incidentId,
                  }
                );
              } else {
                return IncidentManagementActions.updateIncidentManagementActionsError(
                  {
                    error: sanitizeErrorMessage(
                      this.transloco.translate("error")
                    ),
                  }
                );
              }
            }),
            catchError((error) =>
              of(
                IncidentManagementActions.updateIncidentManagementActionsError({
                  error:
                    sanitizeErrorMessage(error.message) ||
                    sanitizeErrorMessage(this.transloco.translate("error")),
                })
              )
            )
          )
      )
    );
  });

  updateIncidentManagementActionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncidentManagementActions.updateIncidentManagementActionsSuccess),
      switchMap(() =>
        this.transloco.selectTranslate("alerts.successfullOperation").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate(
                  "alerts.successfullOperation"
                ),
                detail: this.transloco.translate("alerts.successfullOperation"),
                severity: "success",
                life: 13000,
              },
            })
          )
        )
      )
    );
  });

  updateIncidentManagementActionError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncidentManagementActions.updateIncidentManagementActionsError),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });

  reloadManagedIncidentActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncidentManagementActions.updateIncidentManagementActionsSuccess),
      tap(() =>
        this.incidentManagementManagerService.updateCurrentStepperActiveEventIndex(
          this.incidentManagementManagerService._currentStepperActiveEventIndex
            .value
        )
      ),
      map((manageIncidentActionResponse) =>
        incidentDetailActions.getAllIncidentDetail({
          incidentId: manageIncidentActionResponse.incidentId ?? 0,
        })
      )
    );
  });

  reloadAllIncidentListActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IncidentManagementActions.updateIncidentManagementActionsSuccess),
      map(() => dashboardCoreActions.getAllIncidentsList())
    );
  });
}

@Injectable()
export class GetShipFunctionsByAssetEffects {
  private readonly actions$ = inject(Actions);
  private readonly getShipFunctionsByAssetService = inject(
    RemediationImpactService
  );
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET SHIP FUNCTIONS PER ASSET

  getShipFunctsByAssetList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shipFunctionsByAssetActions.getAllShipFunctionsByAsset),
      exhaustMap((action) =>
        this.getShipFunctionsByAssetService
          .retrieveShipFunctionForAssetInvolved(action.remediationId)
          .pipe(
            map((response) => {
              if (response) {
                return shipFunctionsByAssetActions.getAllShipFunctionsByAssetSuccess(
                  {
                    allShipFunctsByAsset: response,
                  }
                );
              } else {
                return shipFunctionsByAssetActions.errorGetAllShipFunctionsByAsset(
                  {
                    error: sanitizeErrorMessage(
                      this.transloco.translate("error")
                    ),
                  }
                );
              }
            }),
            catchError((error) =>
              of(
                assetActions.errorGetAllAssetsList({
                  error:
                    sanitizeErrorMessage(error.message) ||
                    sanitizeErrorMessage(this.transloco.translate("error")),
                })
              )
            )
          )
      )
    );
  });

  getShipFunctsByAssetListError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shipFunctionsByAssetActions.errorGetAllShipFunctionsByAsset),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });
}

@Injectable()
export class CalculateOperatingPercentageEffects {
  private readonly actions$ = inject(Actions);
  private readonly getShipFunctionsByAssetService = inject(
    RemediationImpactService
  );
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET OPERATING PERCENTAGE

  getOperatingPercentage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        calculateOperatingPercentageActions.getFunctionOperatingPercentage
      ),
      exhaustMap((action) =>
        this.getShipFunctionsByAssetService
          .calculateOperatingPercentageByActionAsset(
            action.assetIP,
            action.hostName
          )
          .pipe(
            map((response) => {
              if (response) {
                return calculateOperatingPercentageActions.getFunctionOperatingPercentageSuccess(
                  {
                    currentStepAsset: response,
                  }
                );
              } else {
                return calculateOperatingPercentageActions.errorGetFunctionOperatingPercentage(
                  {
                    error: sanitizeErrorMessage(
                      this.transloco.translate("error")
                    ),
                  }
                );
              }
            }),
            catchError((error) =>
              of(
                calculateOperatingPercentageActions.errorGetFunctionOperatingPercentage(
                  {
                    error:
                      sanitizeErrorMessage(error.message) ||
                      sanitizeErrorMessage(this.transloco.translate("error")),
                  }
                )
              )
            )
          )
      )
    );
  });

  getOperatingPercentageError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        calculateOperatingPercentageActions.errorGetFunctionOperatingPercentage
      ),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });
}

@Injectable()
export class MarkEventAsFalsePositiveEffects {
  private readonly actions$ = inject(Actions);
  private readonly transloco = inject(TranslocoService);
  private readonly markEventAsFalsePositiveService = inject(
    MarkEventAsFalsePositiveService
  );

  markAsFalsePositiveAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(markEventFalsePositiveActions.markEventAsFalsePositiveActions),
      switchMap((action) =>
        this.markEventAsFalsePositiveService
          .markEventAsFalsePositive(action.markEventAsFalsePositiveRequest)
          .pipe(
            map((response) => {
              if (response) {
                return markEventFalsePositiveActions.markEventAsFalsePositiveActionsSuccess(
                  {
                    markEventAsFalsePositiveResponse: response,
                    incidentId: response.incidentId,
                  }
                );
              } else {
                return markEventFalsePositiveActions.markEventAsFalsePositiveActionsError(
                  {
                    error: sanitizeErrorMessage(
                      this.transloco.translate("error")
                    ),
                  }
                );
              }
            }),
            catchError((error) =>
              of(
                markEventFalsePositiveActions.markEventAsFalsePositiveActionsError(
                  {
                    error:
                      sanitizeErrorMessage(error.message) ||
                      sanitizeErrorMessage(this.transloco.translate("error")),
                  }
                )
              )
            )
          )
      )
    );
  });

  markAsFalsePositiveActionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        markEventFalsePositiveActions.markEventAsFalsePositiveActionsSuccess
      ),
      switchMap(() =>
        this.transloco.selectTranslate("alerts.successfullOperation").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate(
                  "alerts.successfullOperation"
                ),
                detail: this.transloco.translate("alerts.successfullOperation"),
                severity: "success",
                life: 13000,
              },
            })
          )
        )
      )
    );
  });

  markAsFalsePositiveActionError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        markEventFalsePositiveActions.markEventAsFalsePositiveActionsError
      ),
      switchMap((action) =>
        this.transloco.selectTranslate("alerts.error").pipe(
          map(() =>
            messageActions.setMessage({
              message: {
                id: uuid.v4(),
                summary: this.transloco.translate("alerts.genericWarn"),
                detail: sanitizeErrorMessage(action.error),
                severity: "error",
                sticky: true,
              },
            })
          )
        )
      )
    );
  });

  reloadMarkedAsFalsePositiveIncidentActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        markEventFalsePositiveActions.markEventAsFalsePositiveActionsSuccess
      ),
      map((markedAsFalsePositiveIncidentResponse) =>
        incidentDetailActions.getAllIncidentDetail({
          incidentId: markedAsFalsePositiveIncidentResponse.incidentId ?? 0,
        })
      )
    );
  });
}
