import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  catchError,
  EMPTY,
  from,
  Observable,
  switchMap,
  throwError,
} from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Store } from "@ngrx/store";
import { authActions } from "../../auth/state/actions";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const store = inject(Store);

  if (!token) {
    console.warn("Nessun token presente, richiesta bloccata:", req.url);
    return EMPTY;
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        store.dispatch(authActions.logout());
        return EMPTY;
      }

      if (error.status === 401) {
        return from(authService.refreshToken()).pipe(
          switchMap((refreshed) => {
            if (refreshed) {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.getToken()}`,
                },
              });
              return next(retryReq);
            } else {
              authService.logout();
              return throwError(() => error);
            }
          })
        );
      }

      /**
       * altri errori - normale gestione
       */
      return throwError(() => error);
    })
  );
};
