import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { AuthService } from "./app/auth/auth.service";
import { Store } from "@ngrx/store";
import { inject } from "@angular/core";
import { authActions } from "./app/auth/state/actions";

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );
const authService = new AuthService();

authService.init().then((authenticated) => {
  if (!authenticated) {
    authService.login();
    return;
  }
  const decodedToken = authService.getDecodedToken();
  const token = authService.getToken();
  bootstrapApplication(AppComponent, appConfig)
    .then((appRef) => {
      const store = appRef.injector.get(Store);
      if (token && decodedToken) {
        store.dispatch(
          authActions.loginSuccess({
            token,
            decodedToken,
          })
        );
      }
    })
    .catch((err) => console.error(err));
});
