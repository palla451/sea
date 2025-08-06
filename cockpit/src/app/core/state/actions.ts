import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ToastMessage } from "../models/toastMessage.model";
import { IncidentDetail } from "../../features/incident-detail/models/incident-detail.models";
import { Incident } from "../../features/dashboard/models/dashboard.models";
import { Asset } from "../models/asset.model";
import {
  IncidentManageAction,
  IncidentManagementModalRequest,
  IncidentManagementModalResponse,
} from "../models/incident-management-modal.model";
import {
  CurrentStepAsset,
  RemediationImpact,
} from "../models/remediation-impact.model";
import { MarkEventAsFalsePositiveRequest, MarkEventAsFalsePositiveResponse } from "../models/mark-event-as-false-positive.model";

const messageActionsUi = createActionGroup({
  source: "Message Action UI",
  events: {
    "Get Messages": emptyProps(),
    "Set Message": props<{ message: ToastMessage }>(),
    "Remove Message": props<{ id: string }>(),
  },
});

export const messageActions = { ...messageActionsUi };

const IncidentDetailActionsApi = createActionGroup({
  source: "Incident Detail Page Action API",
  events: {
    "Get All Incident Detail": props<{ incidentId: string | number }>(),
    "Get All Incident Detail Success": props<{
      incidentDetailBundle: IncidentDetail[];
    }>(),
    "Error Get All Incident Detail": props<{ error: string }>(),
    "Get All Incident Detail Reset": emptyProps(),
  },
});

export const incidentDetailActions = { ...IncidentDetailActionsApi };

const DashboardActionsApi = createActionGroup({
  source: "Dashboard Page Action API",
  events: {
    "Get All Incidents List": emptyProps(),
    "Get All Incidents List Success": props<{ allIncidentsList: Incident[] }>(),
    "Error Get All Incidents List": props<{ error: string }>(),
    "All Incidents List Reset": emptyProps(),
  },
});

export const dashboardCoreActions = { ...DashboardActionsApi };

const AssetManagementActionsApi = createActionGroup({
  source: "Asset Management Page Action API",
  events: {
    "Get All Assets List": emptyProps(),
    "Get All Assets List Success": props<{ allAssetsList: Asset[] }>(),
    "Error Get All Assets List": props<{ error: string }>(),
    "All Assets List Reset": emptyProps(),
    "Patch Asset": props<{ newAssetState: Asset }>(),
    "Patch Asset Success": emptyProps(),
    "Error Patch Asset": props<{ error: string }>(),
  },
});

export const assetActions = { ...AssetManagementActionsApi };

const IncidentManagementActionsApi = createActionGroup({
  source: "Incident Management Modal Action API",
  events: {
    "Update Incident Management Actions": props<{
      actionStep: IncidentManagementModalRequest;
    }>(),
    "Update Incident Management Actions Success": props<{
      actions: IncidentManageAction[];
      incidentId: number | undefined;
    }>(),
    "Update Incident Management Actions Error": props<{ error: string }>(),
  },
});

export const IncidentManagementActions = { ...IncidentManagementActionsApi };

const GetShipFunctionsByAssetActionsApi = createActionGroup({
  source: "Remediation Management Modal Action API",
  events: {
    "Get All Ship Functions By Asset": props<{
      remediationId: number;
    }>(),
    "Get All Ship Functions By Asset Success": props<{
      allShipFunctsByAsset: RemediationImpact[];
    }>(),
    "Error Get All Ship Functions By Asset": props<{ error: string }>(),
    "Get All Ship Functions By Asset Reset": emptyProps(),
  },
});

export const shipFunctionsByAssetActions = {
  ...GetShipFunctionsByAssetActionsApi,
};

const CalculateFunctionOperatingPercentageActionsApi = createActionGroup({
  source: "Remediation Management Modal Action API",
  events: {
    "Get Function Operating Percentage": props<{
      assetIP: string;
      hostName: string;
    }>(),
    "Get Function Operating Percentage Success": props<{
      currentStepAsset: CurrentStepAsset[];
    }>(),
    "Error Get Function Operating Percentage": props<{ error: string }>(),
    "Get Function Operating Percentage Reset": emptyProps(),
  },
});

export const calculateOperatingPercentageActions = {
  ...CalculateFunctionOperatingPercentageActionsApi,
};

const MarkEventAsFalsePositiveActionsApi = createActionGroup({
  source: "Incident Management Modal Action API",
  events: {
    "Mark Event As False Positive Actions": props<{
      markEventAsFalsePositiveRequest: MarkEventAsFalsePositiveRequest;
    }>(),
    "Mark Event As False Positive Actions Success": props<{
      markEventAsFalsePositiveResponse: MarkEventAsFalsePositiveResponse;
      incidentId: number | undefined;
    }>(),
    "Mark Event As False Positive Actions Error": props<{ error: string }>(),
  },
});

export const markEventFalsePositiveActions = { ...MarkEventAsFalsePositiveActionsApi };
