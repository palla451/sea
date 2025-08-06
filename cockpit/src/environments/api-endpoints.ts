import { environment } from "./environment";

export const API_ENDPOINTS: { [key: string]: string } = {
  update_asset_status: environment.production
    ? "asset/asset/status"
    : "api/asset/asset/status",
  retrieve_asset: environment.production ? "asset/asset" : "api/asset/asset",
  retrieve_ship_functions: environment.production
    ? "asset/function"
    : "api/asset/function",
  retrieve_single_incident: environment.production
    ? "case/incident"
    : "api/case/incident",
  retrieve_incident: environment.production
    ? "case/incident"
    : "api/case/incident",
  retrieve_action: environment.production ? "case/action" : "api/case/action",
  manage_action: environment.production
    ? "case/action/manage"
    : "api/case/action/manage",
  get_ship_functions_by_asset: environment.production
    ? "case/functionAsset"
    : "api/case/functionAsset",
  calculate_op_percentage_by_asset: environment.production
    ? "risk/restoreOperatingPercentage"
    : "api/risk/restoreOperatingPercentage",
  retrieve_remediations_list: environment.production
    ? "case/remediation/detail"
    : "api/case/remediation/detail",
  remediation_rollback: environment.production
    ? "case/action/rollback"
    : "api/case/action/rollback",
  mark_event_as_false_positive: environment.production
    ? "case/event/manage"
    : "api/case/event/manage",
  logout_to_be_cache_cleanup: environment.production
    ? "case/logout"
    : "api/case/logout",
};
