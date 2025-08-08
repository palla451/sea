import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TranslocoService } from "@jsverse/transloco";
import { shipFunctionsActions } from "./actions";
import { catchError, map, of, switchMap } from "rxjs";
import { messageActions } from "../../../core/state/actions";
import * as uuid from "uuid";
import { DashboardService } from "../services/dashboard.service";
import { sanitizeErrorMessage } from "../../../core/utils/string-functions";

@Injectable()
export class GetShipFunctionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashBoardService = inject(DashboardService);
  private readonly transloco = inject(TranslocoService);

  // EFFECTS RELATIVI ALLA GET DELLE SHIP FUNCTIONS

  getAllShipFunctions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shipFunctionsActions.getAllShipFunctions),
      switchMap(() =>
        this.dashBoardService.getRetrieveShipFunctions().pipe(
          map((response) => {
            if (response) {
              return shipFunctionsActions.getAllShipFunctionsSuccess({
                allShipFunctions: response,
              });
            } else {
              return shipFunctionsActions.errorGetAllShipFunctions({
                error: sanitizeErrorMessage(this.transloco.translate("error")),
              });
            }
          }),
          catchError((error) =>
            of(
              shipFunctionsActions.errorGetAllShipFunctions({
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

  //   getAllShipFunctionsSuccess$ = createEffect(() => {
  //     return this.actions$.pipe(
  //       ofType(shipFunctionsActions.getAllShipFunctionsSuccess),
  //       switchMap(() =>
  //         this.transloco.selectTranslate("alerts.successfullOperation").pipe(
  //           map(() =>
  //             messageActions.setMessage({
  //               message: {
  //                 id: uuid.v4(),
  //                 summary: this.transloco.translate("alerts.successfullOperation"),
  //                 detail: this.transloco.translate("alerts.successfullOperation"),
  //                 severity: "success",
  //                 life: 13000,
  //               },
  //             })
  //           )
  //         )
  //       )
  //     );
  //   });

  getAllShipFunctionsError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shipFunctionsActions.errorGetAllShipFunctions),
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
