import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { DecodedToken } from "../models/auth.model";
import { authActions } from "./actions";

export interface AuthState {
  token: string | null;
  decodedToken: DecodedToken | null;
}

const initialState: AuthState = {
  token: null,
  decodedToken: null,
};

export const authFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialState,
    on(authActions.loginSuccess, (state, { token, decodedToken }) => ({
      ...state,
      token,
      decodedToken,
    })),
    on(authActions.setToken, (state, { token, decodedToken }) => ({
      ...state,
      token,
      decodedToken,
    })),
    on(authActions.logout, () => initialState),
    on(authActions.logoutSuccess, () => initialState),
    on(authActions.logoutFailure, (state) => ({
      ...state,
    }))
  ),
});

export const selectDecodedToken = authFeature.selectDecodedToken;

export const selectRoles = createSelector(
  selectDecodedToken,
  (decoded) => decoded?.resource_access?.["mcsp-cockpit-oidc"]?.roles ?? []
);

export const hasPrivilegedAccess = createSelector(
  selectRoles,
  (roles) =>
    roles.includes("cockpit-operator") ||
    roles.includes("cockpit-administrator")
);
export const hasAdminExclusiveAccess = createSelector(selectRoles, (roles) =>
  roles.includes("cockpit-administrator")
);
