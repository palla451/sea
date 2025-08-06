import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { OpenIncidentsPageComponent } from "../open-incidents-page/open-incidents-page.component";

export const openIncidentsRoutes: Routes = [
  {
    path: "",
    component: OpenIncidentsPageComponent,
    providers: [
      // provideState(shipFunctionsFeature),
      // provideEffects(GetShipFunctionsEffects),
    ],
  },
];
