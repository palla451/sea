export interface AssetResponse {
  assets: Asset[];
}
export interface AssetRequest {
  assets: AssetReq[];
}
export interface AssetReq {
  pieceMark: string;
  status: string;
}
export interface Asset {
  id: number;
  pieceMark: string;
  type: string;
  systemInfo: string;
  deck: number;
  mvz: number;
  frame: number;
  position: string;
  room: string;
  cabinet: string;
  status: string;
  name: string;
  vendor?: Vendor;
  functions?: Function[];
  creationDate: string;
  updateDate?: string | null;
}

export interface Vendor {
  id: string;
  name: string;
  creationDate: string;
}

export interface Function {
  id: number;
  parent?: string | Function[] | null;
  name: string;
  description?: string;
  operatingPercentage: number;
  creationDate?: string;
  updateDate?: string | null;
}
