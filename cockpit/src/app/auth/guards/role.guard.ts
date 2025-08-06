import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectRoles } from "../../auth/state";
import { Router } from "@angular/router";
import { map, take } from "rxjs/operators";

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectRoles).pipe(
      
      map((roles) => {
        const hasRole = allowedRoles.some((r) => roles.includes(r));
        if (!hasRole) router.navigate(["/overview"]);
        return hasRole;
      })
    );
  };
}
