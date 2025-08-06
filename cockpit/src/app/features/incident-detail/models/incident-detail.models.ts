export interface IncidentDetailResponse {
  incidents: IncidentDetail[];
}
export interface IncidentDetail {
  id: number;
  title: string;
  description: string;
  severity: string;
  critically: string;
  summary: string;
  tags: string;
  status: string;
  createdAt: string;
  events: IncidentEvent[];
  creationDate: string;
}
export interface IncidentEvent {
  id: number;
  name: string;
  description: string;
  type: string;
  eventDate: string;
  alertLog: string;
  status: string;
  remediation: Remediation;
  creationDate: string;
}
export interface Remediation {
  id: number;
  remediationCatalogId?: number;
  description: string;
  status: string;
  actions: Action[];
  creationDate: string;
}
export interface Action {
  id: number;
  actionCatalog?: ActionCatalog;
  description: string;
  note: string;
  status: string;
  actionType: string;
  asset: IncidentDetailAsset;
  creationDate: string;
  updateDate?: string;
}

export interface ActionCatalog {
  id: number;
  actionType: string;
  name: string;
  description: string;
  compromisingAction: boolean;
  creationDate: string;
}

export interface IncidentDetailAsset {
  id: number;
  shipId: number;
  externalAssetId: number;
  pieceMark: string;
  description: string;
  assetRole: string;
  deck: string;
  frame: string;
  type: string;
  mvz: string;
  position: string;
  ipAddress?: string;
  hostName?: string;
  macAddress: string;
  shipFunctions: ShipFunction[];
  creationDate: string;
}
export interface ShipFunction {
  function: string;
  id: number;
  pieceMark: string;
  percentage: string;
  creationDate: string;
}

export interface DeckAssets {
  deck: string;
  assets: IncidentDetailAsset[];
}

export interface IncidentTimelineEvents {
  id: number;
  name: string;
  description: string;
  type: string;
  eventDate: string;
  creationDate: string;
  creationTime: string;
  assetId: number | null;
  icon: string;
}

export interface IncidentTimelineEventsModal {
  event: IncidentTimelineEvents;
  asset: IncidentTimelineAssetsModal | null;
}

export interface IncidentTimelineAssetsModal {
  ipAddress: string;
  macAddress: string;
  assetRole: string;
}
