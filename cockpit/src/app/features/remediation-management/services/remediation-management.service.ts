import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { map, Observable, of } from "rxjs";
import {
  ActionRollbackReq,
  GetRemediationListResponse,
  RemediationItem,
  RemediationReq,
  RemediationRequest,
} from "../models/remediation-management.models";
import { environment } from "../../../../environments/environment";
import { API_ENDPOINTS } from "../../../../environments/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class RemediationManagementService {
  private apiService = inject(ApiService);

  private mockedRemediations: RemediationItem[] = [
    {
      incidentId: 36,
      incidentDescription: "create description_120",
      actionId: 48,
      actionType: "Human",
      description: "action description 120",
      status: "Completed",
      updateDate: "2025-06-22T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 9,
      incidentDescription: "create description_44",
      actionId: 4,
      actionType: "Assisted",
      description: "action description 7",
      status: "Completed",
      updateDate: "2025-05-14T08:23:10.031+00:00",
      rollbackable: false,
    },
    {
      incidentId: 8,
      incidentDescription: "create description_44",
      actionId: 1,
      actionType: "Automated",
      description: "action description 44",
      status: "Completed",
      updateDate: "2025-05-11T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 51,
      incidentDescription: "create description_51",
      actionId: 48,
      actionType: "Human",
      description: "action description 120",
      status: "Completed",
      updateDate: "2025-06-22T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 9,
      incidentDescription: "create description_91",
      actionId: 4,
      actionType: "Assisted",
      description: "action description 91",
      status: "Completed",
      updateDate: "2025-05-14T08:23:10.031+00:00",
      rollbackable: false,
    },
    {
      incidentId: 8,
      incidentDescription: "create description_68",
      actionId: 1,
      actionType: "Automated",
      description: "action description 68",
      status: "Completed",
      updateDate: "2025-05-11T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 43,
      incidentDescription: "create description_43",
      actionId: 48,
      actionType: "Human",
      description: "action description 120",
      status: "Completed",
      updateDate: "2025-06-22T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 78,
      incidentDescription: "create description_78",
      actionId: 4,
      actionType: "Assisted",
      description: "action description 7",
      status: "Completed",
      updateDate: "2025-05-14T08:23:10.031+00:00",
      rollbackable: false,
    },
    {
      incidentId: 33,
      incidentDescription: "create description_33",
      actionId: 1,
      actionType: "Automated",
      description: "action description 44",
      status: "Completed",
      updateDate: "2025-05-11T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 31,
      incidentDescription: "create description_31",
      actionId: 48,
      actionType: "Human",
      description: "action description 120",
      status: "Completed",
      updateDate: "2025-06-22T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 20,
      incidentDescription: "create description_20",
      actionId: 4,
      actionType: "Assisted",
      description: "action description 91",
      status: "Completed",
      updateDate: "2025-05-14T08:23:10.031+00:00",
      rollbackable: false,
    },
    {
      incidentId: 16,
      incidentDescription: "create description_16",
      actionId: 1,
      actionType: "Automated",
      description: "action description 68",
      status: "Completed",
      updateDate: "2025-05-11T22:00:00.000+00:00",
      rollbackable: true,
    },
    {
      incidentId: 19,
      incidentDescription: "create description_19",
      actionId: 1,
      actionType: "Automated",
      description: "action description 68",
      status: "Completed",
      updateDate: "2025-05-11T22:00:00.000+00:00",
      rollbackable: true,
    },
  ];

  getRetrieveRemediationList(): Observable<RemediationItem[]> {
    if (environment.isMockActive) {
      return of(this.mockedRemediations);
    } else {
      const apiurl = API_ENDPOINTS["retrieve_remediations_list"];
      return this.apiService
        .get<GetRemediationListResponse>(apiurl)
        .pipe(
          map(
            (sourceRemediationsResponse) =>
              sourceRemediationsResponse?.remediations
          )
        );
    }
  }

  mockedUpdateRemediationResponse: GetRemediationListResponse = {
    remediations: this.mockedRemediations,
  };

  rollbackAction(
    actionId: number
  ): Observable<GetRemediationListResponse> {
    if (environment.isMockActive) {
      return of(this.mockedUpdateRemediationResponse);
    } else {
      const apiurl = API_ENDPOINTS["remediation_rollback"];
      const actionRollbacReq: ActionRollbackReq = {
        actionId
      };

      return this.apiService.patch<GetRemediationListResponse>(
        apiurl,
        actionRollbacReq
      );
    }
  }
}
