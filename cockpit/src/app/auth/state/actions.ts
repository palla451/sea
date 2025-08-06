import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { DecodedToken } from "../models/auth.model";

export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    login: props<{ redirectUri: string }>(),
    loginSuccess: props<{ token: string; decodedToken: DecodedToken }>(),
    loginFailure: emptyProps(),

    refreshToken: emptyProps(),
    refreshTokenSuccess: props<{ token: string; decodedToken: DecodedToken }>(),
    refreshTokenFailure: emptyProps(),

    setToken: props<{ token: string; decodedToken: DecodedToken }>(),

    logout: emptyProps(),
    logoutSuccess: emptyProps(),
    logoutFailure: emptyProps(),
  },
});

export const authActions = { ...AuthActions };
