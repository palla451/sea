// import { inject, Injectable } from "@angular/core";
// import { catchError, map, Observable, of, retry, switchMap, tap, throwError } from "rxjs";
// import {
//   IncidentManagementModalRequest,
//   IncidentManagementModalResponse,
// } from "../models/incident-management-modal.model";
// import { environment } from "../../../environments/environment";
// import { API_ENDPOINTS } from "../../../environments/api-endpoints";
// import { ApiService } from "./api.service";
// import { IncidentManagementManagerService } from "./incident-management-manager.service";
// import { Store } from "@ngrx/store";
// import { fromIncidentDetail } from "../state";

// @Injectable({
//   providedIn: "root",
// })
// export class IncidentManagementModalService {
//   private readonly store = inject(Store);
//   private apiService = inject(ApiService);
//   private incidentManagementManagerService = inject(
//     IncidentManagementManagerService
//   );
//   private localCurrentAPICounterValue: number = 0;

//   mockedResponseActionManage: IncidentManagementModalResponse = {
//     actions: [
//       {
//         id: 6,
//         actionCatalog: {
//           id: 2,
//           shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
//           name: "FAKE_REMEDIATION_ACTION2",
//           description: "Echo test",
//           compromisingAction: false,
//           creationDate: "2025-05-12T22:00:00.000+00:00",
//           note: "update note 185",
//         },
//         description: "action description 185",
//         note: "update note 185",
//         status: "completed",
//         actionType: "Automated",
//         creationDate: "2025-05-15T08:10:13.606+00:00",
//         updateDate: "2025-05-15T08:10:13.606+00:00",
//       },
//       {
//         id: 7,
//         actionCatalog: {
//           id: 2,
//           shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
//           name: "FAKE_REMEDIATION_ACTION2",
//           description: "Echo test",
//           compromisingAction: false,
//           creationDate: "2025-05-12T22:00:00.000+00:00",
//           note: "update note 185",
//         },
//         description: "action description 142",
//         note: "update note 142",
//         status: "completed",
//         actionType: "Assisted",
//         creationDate: "2025-05-15T08:10:14.166+00:00",
//         updateDate: "2025-05-15T08:10:14.166+00:00",
//       },
//       {
//         id: 89,
//         actionCatalog: {
//           id: 2,
//           shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
//           name: "FAKE_REMEDIATION_ACTION2",
//           description: "Echo test",
//           compromisingAction: false,
//           creationDate: "2025-05-12T22:00:00.000+00:00",
//           note: "update note 185",
//         },
//         description: "action description 89",
//         note: "update note 89",
//         status: "completed",
//         actionType: "Human",
//         creationDate: "2025-05-15T08:10:14.166+00:00",
//         updateDate: "2025-05-15T08:10:14.166+00:00",
//       },
//     ],
//   };

//   actionManage(
//     newActionRequest: IncidentManagementModalRequest
//   ): Observable<IncidentManagementModalResponse> {
//     if (environment.isMockActive) {
//       return of(this.mockedResponseActionManage);
//     } else {
//       const apiurl = API_ENDPOINTS["manage_action"];
//       return this.store
//         .select(fromIncidentDetail.selectIncidentDetailBundle)
//         .pipe(
//           map((incidents) => incidents[0]),
//           switchMap((triggeredIncident) =>
//             this.apiService
//               .patch<IncidentManagementModalResponse>(apiurl, newActionRequest)
//               .pipe(
//                 tap((incidentManagementModalResponse) => {
//                   this.incidentManagementManagerService.updateIncidentRemediationStepperAPICounter(0);

//                   if (incidentManagementModalResponse) {
//                     this.incidentManagementManagerService.setStepperToInitialState(triggeredIncident);
//                     // this.incidentManagementManagerService.incrementStepperState(
//                     //   triggeredIncident
//                     // );
//                   }
//                 }),
//                 catchError(err => {
//                   let currentAPICounterValue = this.incidentManagementManagerService._manageIncidentRemediationStepperAPICounter?.value;
//                   this.incidentManagementManagerService.updateIncidentRemediationStepperAPICounter(currentAPICounterValue++);
//                   console.error('Patch fallita dopo retry:',err, currentAPICounterValue);
//                   return throwError(() => err);
//                 })
//               )
//           )
//         );
//     }
//   }
// }



import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, switchMap, tap, throwError, timer } from "rxjs";
import {
  IncidentManagementModalRequest,
  IncidentManagementModalResponse,
} from "../models/incident-management-modal.model";
import { environment } from "../../../environments/environment";
import { API_ENDPOINTS } from "../../../environments/api-endpoints";
import { ApiService } from "./api.service";
import { IncidentManagementManagerService } from "./incident-management-manager.service";
import { Store } from "@ngrx/store";
import { fromIncidentDetail } from "../state";

@Injectable({
  providedIn: "root",
})
export class IncidentManagementModalService {
  private readonly store = inject(Store);
  private apiService = inject(ApiService);
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );
  private localCurrentAPICounterValue: number = 0;
  private maxGlobalRetries: number = 6; // 2 cicli di 3 retry
  private maxRetryAttempts: number = 3; // Tentativi per ogni chiamata

  mockedResponseActionManage: IncidentManagementModalResponse = {
    actions: [
      {
        id: 6,
        actionCatalog: {
          id: 2,
          shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
          name: "FAKE_REMEDIATION_ACTION2",
          description: "Echo test",
          compromisingAction: false,
          creationDate: "2025-05-12T22:00:00.000+00:00",
          note: "update note 185",
        },
        description: "action description 185",
        note: "update note 185",
        status: "completed",
        actionType: "Automated",
        creationDate: "2025-05-15T08:10:13.606+00:00",
        updateDate: "2025-05-15T08:10:13.606+00:00",
      },
      {
        id: 7,
        actionCatalog: {
          id: 2,
          shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
          name: "FAKE_REMEDIATION_ACTION2",
          description: "Echo test",
          compromisingAction: false,
          creationDate: "2025-05-12T22:00:00.000+00:00",
          note: "update note 185",
        },
        description: "action description 142",
        note: "update note 142",
        status: "completed",
        actionType: "Assisted",
        creationDate: "2025-05-15T08:10:14.166+00:00",
        updateDate: "2025-05-15T08:10:14.166+00:00",
      },
      {
        id: 89,
        actionCatalog: {
          id: 2,
          shuffleId: "webhook_653a68e7-3b09-518c-9275-f85f601ae0ac",
          name: "FAKE_REMEDIATION_ACTION2",
          description: "Echo test",
          compromisingAction: false,
          creationDate: "2025-05-12T22:00:00.000+00:00",
          note: "update note 185",
        },
        description: "action description 89",
        note: "update note 89",
        status: "completed",
        actionType: "Human",
        creationDate: "2025-05-15T08:10:14.166+00:00",
        updateDate: "2025-05-15T08:10:14.166+00:00",
      },
    ],
  };

  actionManage(
    newActionRequest: IncidentManagementModalRequest
  ): Observable<IncidentManagementModalResponse> {
    if (environment.isMockActive) {
      return of(this.mockedResponseActionManage);
    } else {
      // Reset del contatore se ha raggiunto il massimo
      if (this.localCurrentAPICounterValue >= this.maxGlobalRetries) {
        this.localCurrentAPICounterValue = 0;
      }

      const apiurl = API_ENDPOINTS["manage_action"];
      return this.store
        .select(fromIncidentDetail.selectIncidentDetailBundle)
        .pipe(
          map((incidents) => incidents[0]),
          switchMap((triggeredIncident) =>
            this.apiService
              .patch<IncidentManagementModalResponse>(apiurl, {
                ...newActionRequest,
                retryCounter: this.localCurrentAPICounterValue
              })
              .pipe(
                // Esegui retry se la prima action ha status 'error' e non abbiamo superato i tentativi globali
                retry({
                  count: this.maxRetryAttempts,
                  delay: (error, retryCount) => {
                    // Verifica se l'errore è una response con actions[0].status === 'error'
                    const isRetryableError = error?.actions?.[0]?.status === 'error';
                    
                    if (isRetryableError && this.localCurrentAPICounterValue < this.maxGlobalRetries) {
                      this.localCurrentAPICounterValue++;
                      console.log(`Tentativo ${retryCount} di ${this.maxRetryAttempts}. Contatore globale: ${this.localCurrentAPICounterValue}`);
                      // Delay esponenziale tra i retry
                      return timer(1000);
                    }
                    // Se non è un errore retryable o abbiamo superato i tentativi, lancia l'errore
                    return throwError(() => error);
                  }
                }),
                tap((incidentManagementModalResponse) => {
                  // Reset del contatore globale se la chiamata ha successo
                  this.localCurrentAPICounterValue = 0;
                  this.incidentManagementManagerService.updateIncidentRemediationStepperAPICounter(0);

                  if (incidentManagementModalResponse) {
                    this.incidentManagementManagerService.setStepperToInitialState(triggeredIncident);
                  }
                }),
                catchError(err => {
                  console.error('Patch fallita dopo retry:', err);
                  return throwError(() => err);
                })
              )
          )
        );
    }
  }
}

