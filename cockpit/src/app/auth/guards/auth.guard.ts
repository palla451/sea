import { Injectable, inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs/operators";
import { authFeature } from "../state";
import { AuthService } from "../auth.service";

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token) {
    return true;
  } else {
    authService.login();
    return false;
  }
};
