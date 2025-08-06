import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
  inject,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TranslocoHttpLoader } from "./transloco-loader";
import { provideTransloco } from "@jsverse/transloco";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideState, provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import {
  assetsFeature,
  calculateOperatingPercentageFeature,
  dashboardCoreFeature,
  getAllShipFunctsByAssetFeature,
  incidentDetailFeature,
  markEventAsFalsePositiveFeature,
  messageFeature,
  updateIncidentManagementActionsFeature,
} from "./core/state";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import Aura from "@primeng/themes/aura";
import {
  IncidentDetailEffects,
  DashboardEffects,
  AssetManagementEffects,
  IncidentManagementModalEffects,
  GetShipFunctionsByAssetEffects,
  CalculateOperatingPercentageEffects,
  MarkEventAsFalsePositiveEffects,
} from "./core/state/effects";
import { authInterceptor } from "./core/interceptors/http.interceptor";
import { GetIncidentRemediationsEffects } from "./features/remediation-management/state/effects";
import { incidentRemediationsFeature } from "./features/remediation-management/state";
import { authFeature } from "./auth/state";
import { AuthEffects } from "./auth/state/effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideState(messageFeature),
    provideState(incidentDetailFeature),
    provideState(dashboardCoreFeature),
    provideState(assetsFeature),
    provideState(updateIncidentManagementActionsFeature),
    provideState(getAllShipFunctsByAssetFeature),
    provideState(calculateOperatingPercentageFeature),
    provideState(incidentRemediationsFeature),
    provideState(markEventAsFalsePositiveFeature),
    provideEffects(IncidentDetailEffects),
    provideEffects(DashboardEffects),
    provideEffects(AssetManagementEffects),
    provideEffects(GetIncidentRemediationsEffects),
    provideEffects(MarkEventAsFalsePositiveEffects),
    provideEffects(IncidentManagementModalEffects),
    provideEffects(GetShipFunctionsByAssetEffects),
    provideEffects(CalculateOperatingPercentageEffects),
    provideState(authFeature),
    provideEffects(AuthEffects),
    provideStoreDevtools({
      maxAge: 25, // Mantiene le ultime 25 azioni nello store
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ["en", "it"],
        defaultLang: "en",
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: "it",
      },
      loader: TranslocoHttpLoader,
    }),
    MessageService,
  ],
};
