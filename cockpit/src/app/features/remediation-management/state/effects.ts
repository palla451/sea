import { inject, Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { incidentRemediationsActions } from "./actions";
import { catchError, map, of, switchMap } from "rxjs";
import { RemediationManagementService } from "../services/remediation-management.service";
import { messageActions } from "../../../core/state/actions";
import * as uuid from "uuid";
import { sanitizeErrorMessage } from "../../../core/utils/string-functions";

@Injectable()
export class GetIncidentRemediationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly remediationManagementService = inject(
    RemediationManagementService
  );
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET DEGLI INCIDENT REMEDIATIONS

  getAllIncidentRemediations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.getAllRemediations),
      switchMap(() =>
        this.remediationManagementService.getRetrieveRemediationList().pipe(
          map((response) => {
            if (response) {
              return incidentRemediationsActions.getAllRemediationsSuccess({
                allRemediations: response,
              });
            } else {
              return incidentRemediationsActions.errorGetAllRemediations({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              incidentRemediationsActions.errorGetAllRemediations({
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

  // getAllIncidentRemediationsSuccess$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(incidentRemediationsActions.getAllRemediationsSuccess),
  //     switchMap(() =>
  //       this.transloco.selectTranslate("alerts.successfullOperation").pipe(
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

  getAllIncidentRemediationsError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.errorGetAllRemediations),
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

  // EFFECTS RELATIVI ALLA ROLLBACK DI UNA ACTION NELLA TABELLA DELLE REMEDIATIONS

  rollbackAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.rollbackAction),
      switchMap((action) =>
        this.remediationManagementService.rollbackAction(action.actionId).pipe(
          map((response) => {
            if (response) {
              return incidentRemediationsActions.rollbackActionSuccess();
            } else {
              return incidentRemediationsActions.errorRollbackAction({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              incidentRemediationsActions.errorRollbackAction({
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

  rollbackActionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.rollbackActionSuccess),
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

  rollbackActionError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.errorRollbackAction),
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

  reloadIncidentRemediations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(incidentRemediationsActions.rollbackActionSuccess),
      switchMap(() =>
        this.transloco
          .selectTranslate("alerts.successfullOperation")
          .pipe(map(() => incidentRemediationsActions.getAllRemediations()))
      )
    );
  });
}
