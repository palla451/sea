export interface RemediationImpactResponse {
  functions: RemediationImpact[];
}

export interface RemediationImpact {
  function: string;
  asset: RemediationAssetInvolved;
  id: number;
  pieceMark: string;
  percentage: string;
  creationDate: string;
}

export interface RemediationAssetInvolved {
  pieceMark: string;
  description: string;
}

export interface CalculateOperatinPercentageByAssetResponse {
  asset: CurrentStepAsset[];
}

export interface CurrentStepAsset {
  pieceMark: string;
  ipAddress: string;
  functions: AssetFunction[];
}

export interface AssetFunction {
  id: number;
  name: string;
  operatingPercentage: number;
  parent?: FunctionImpactedParent;
}

export interface FunctionImpactedParent {
  id: number;
  name: string;
  operatingPercentage: number;
}
