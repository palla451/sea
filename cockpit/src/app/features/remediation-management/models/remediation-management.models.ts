export interface RemediationItem {
  incidentId: number;
  incidentDescription: string;
  actionId: number;
  actionType: string;
  description: string;
  status: string;
  updateDate: string;
  rollbackable: boolean;
}

export interface RemediationManagementTableColumns {
  field: string;
  header: string;
  visible: boolean;
  sortable: boolean;
}

export interface GetRemediationListResponse {
  remediations: RemediationItem[];
}
export interface RemediationRequest {
  remediations: RemediationReq[];
}
export interface RemediationReq {
  incidentId: number;
  status: string;
}
export interface ActionRollbackReq {
  actionId: number;
}
