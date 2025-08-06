export interface IncidentManagementModalResponse {
  actions: IncidentManageAction[];
  incidentId?: number;
}
export interface IncidentManagementModalRequest {
  actionId: number;
  note?: string;
  retryCounter?: number;
}
export interface IncidentManageAction {
  id: number;
  actionCatalog: ActionCatalog;
  actionType: string;
  description: string;
  note: string;
  status: string;
  creationDate: string;
  updateDate: string;
}
export interface ActionCatalog {
  id: number;
  shuffleId: string;
  name: string;
  description: string;
  note: string;
  compromisingAction: boolean;
  creationDate: string;
}
