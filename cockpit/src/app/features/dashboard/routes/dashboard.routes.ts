import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { DashboardPageComponent } from "../dashboard-page/dashboard-page.component";
import { shipFunctionsFeature } from "../state";
import { GetShipFunctionsEffects } from "../state/effects";

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardPageComponent,
    providers: [
      provideState(shipFunctionsFeature),
      provideEffects(GetShipFunctionsEffects),
    ],
  },
];
