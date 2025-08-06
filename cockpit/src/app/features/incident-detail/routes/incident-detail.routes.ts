import { Routes } from "@angular/router";
import { IncidentDetailPageComponent } from "../incident-detail-page/incident-detail-page.component";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { incidentDetailFeature } from "../../../core/state";
import { IncidentDetailEffects } from "../../../core/state/effects";

export const incidentDetailRoutes: Routes = [
  {
    path: "",
    component: IncidentDetailPageComponent,
    // providers: [
    //   provideState(incidentDetailFeature),
    //   provideEffects(IncidentDetailEffects),
    // ],
  },
];
