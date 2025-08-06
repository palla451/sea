import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { HistoryPageComponent } from "../history-page/history-page.component";

export const historyRoutes: Routes = [
  {
    path: "",
    component: HistoryPageComponent,
    providers: [
      // provideState(dashboardFeature),
      // provideEffects(DashboardEffects),
    ],
  },
];
