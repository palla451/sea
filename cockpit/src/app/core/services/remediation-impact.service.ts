import { inject, Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { API_ENDPOINTS } from "../../../environments/api-endpoints";
import { environment } from "../../../environments/environment";
import { ApiService } from "./api.service";
import {
  CalculateOperatinPercentageByAssetResponse,
  CurrentStepAsset,
  RemediationImpact,
  RemediationImpactResponse,
} from "../models/remediation-impact.model";
import { HttpParams } from "@angular/common/http";
import { Store } from '@ngrx/store';
import { getAllShipFunctsByAssetFeature } from "../state";
import { fromCyberResilience } from "../../features/dashboard/state";
import { FunctionNode } from "../../features/dashboard/models/dashboard.models";

@Injectable({
  providedIn: "root",
})
export class RemediationImpactService {
  private apiService = inject(ApiService);
  private readonly store = inject(Store);

  mockedRemediationImpacts: RemediationImpact[] = [
    {
      function: "functionName1",
      asset: {
        pieceMark: "A3",
        description: "create description",
      },
      id: 106,
      pieceMark: "A3",
      percentage: "100",
      creationDate: "2025-05-14T07:41:03.386+00:00",
    },
    {
      function: "functionName2",
      asset: {
        pieceMark: "A3",
        description: "create description",
      },
      id: 107,
      pieceMark: "A3",
      percentage: "50",
      creationDate: "2025-05-14T07:41:03.400+00:00",
    },
    {
      function: "functionName1",
      asset: {
        pieceMark: "A3",
        description: "create description",
      },
      id: 109,
      pieceMark: "A3",
      percentage: "100",
      creationDate: "2025-05-14T07:41:03.430+00:00",
    },
    {
      function: "functionName2",
      asset: {
        pieceMark: "A3",
        description: "create description",
      },
      id: 119,
      pieceMark: "A3",
      percentage: "50",
      creationDate: "2025-05-14T07:41:03.438+00:00",
    },
  ];

  mockedRemediationImpactresponse: RemediationImpactResponse = {
    functions: this.mockedRemediationImpacts,
  };

  mockedCurrentStepAsset: CurrentStepAsset = {
    pieceMark: "A1",
    ipAddress: "1.1.1.1",
    functions: [
      {
        id: 106,
        name: "Left Axis Line",
        operatingPercentage: 50,
      },
      {
        id: 124,
        name: "SubFunction1.4",
        operatingPercentage: 60,
      },
      {
        id: 108,
        name: "SubFunction 1",
        operatingPercentage: 40,
      },
    ],
  };

  mockedCalculateOpPercentageByAssetResponse: CalculateOperatinPercentageByAssetResponse =
    {
      asset: [this.mockedCurrentStepAsset],
    };

  retrieveShipFunctionForAssetInvolved(
    remediationId: number
  ): Observable<RemediationImpact[]> {
    if (environment.isMockActive) {
      return of(this.mockedRemediationImpacts);
    } else {
      const apiurl = API_ENDPOINTS["get_ship_functions_by_asset"];
      let params = new HttpParams();
      if (remediationId) {
        params = params.set("remediationId", remediationId.toString());
      }

      return this.apiService
        .get<RemediationImpactResponse>(apiurl, params)
        .pipe(
          map(
            (remediationImpactResponse) => remediationImpactResponse.functions
          )
        );
    }
  }

  calculateOperatingPercentageByActionAsset(
    assetIP: string,
    hostName: string
  ): Observable<CurrentStepAsset[]> {
    if (environment.isMockActive) {
      return of([this.mockedCurrentStepAsset]);
    } else {
      const apiurl = API_ENDPOINTS["calculate_op_percentage_by_asset"];
      let params = new HttpParams();
      if (assetIP && assetIP !== '') {
        params = params.set("asset", assetIP);
      }else if(hostName && hostName !== ''){
        params = params.set("hostName", hostName);
      }

      return this.apiService
        .get<CalculateOperatinPercentageByAssetResponse>(apiurl, params)
        .pipe(
          map(
            (opPercentageByAssetResponse) => opPercentageByAssetResponse.asset
          )
        );
    }
  }

  getFunctionMap(incidentResponse: RemediationImpact[]) {
    return this.store.select(fromCyberResilience.selectShipFunctions).pipe(
      map((cyberResilienceData: FunctionNode[]) => {
        // Estrai le macrofunctions (quelle senza parent)
        const macroFunctions = cyberResilienceData.filter(fn => !fn.parent);
        
        // Crea la mappa risultato
        const resultMap: {[macroFunctionName: string]: RemediationImpact[]} = {};

        macroFunctions?.forEach(macroFn => {
          // Trova tutte le functions figlie (con parent.id = macroFn.id)
          const childFunctions = cyberResilienceData.filter(fn => 
            fn.parent?.id === macroFn.id
          );

          // Trova tutte le funzioni incidenti correlate
          const relatedIncidentFunctions = incidentResponse.filter(incidentFn => {
            // 1. Caso diretto: la funzione incidente corrisponde alla macrofunction
            if (macroFn.name === incidentFn.function || macroFn.id === incidentFn.id) {
              return true;
            }

            // 2. Caso indiretto: la funzione incidente corrisponde a una child function
            return childFunctions.some(childFn => 
              childFn.name === incidentFn.function || childFn.id === incidentFn.id
            );
          });

          // Aggiungi alla mappa solo se ci sono corrispondenze
          if (relatedIncidentFunctions.length > 0) {
            resultMap[macroFn.name] = relatedIncidentFunctions;
          }
        });

        return resultMap;
      })
    );
  }

}
