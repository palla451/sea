import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../auth.service";
import { authActions } from "./actions";
import { from, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap(() =>
        from(this.authService.init()).pipe(
          map((authenticated) => {
            if (authenticated) {
              const token = this.authService.getToken();
              const decoded = this.authService.getDecodedToken();

              if (token && decoded) {
                return authActions.loginSuccess({
                  token,
                  decodedToken: decoded,
                });
              }
            }

            return authActions.loginFailure();
          }),
          catchError(() => of(authActions.loginFailure()))
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshToken),
      switchMap(() =>
        from(this.authService.refreshToken()).pipe(
          map((refreshed) => {
            if (refreshed) {
              const token = this.authService.getToken();
              const decoded = this.authService.getDecodedToken();
              if (token && decoded) {
                localStorage.setItem("access_token", token);
                return authActions.setToken({ token, decodedToken: decoded });
              }
            }
            return authActions.refreshTokenFailure();
          }),
          catchError(() => of(authActions.refreshTokenFailure()))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      switchMap(() =>
        from(this.authService.logout()).pipe(
          map(() => authActions.logoutSuccess()),
          catchError(() => of(authActions.logoutFailure()))
        )
      )
    )
  );
}
