import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { RemediationItem } from "../models/remediation-management.models";

const RemediationListActionsApi = createActionGroup({
  source: "Remediation List Page Action API",
  events: {
    "Get All Remediations": emptyProps(),
    "Get All Remediations Success": props<{
      allRemediations: RemediationItem[];
    }>(),
    "Error Get All Remediations": props<{ error: string }>(),
    "All Remediations Reset": emptyProps(),
    "Rollback Action": props<{
      actionId: number;
    }>(),
    "Rollback Action Success": emptyProps(),
    "Error Rollback Action": props<{ error: string }>(),
  },
});

export const incidentRemediationsActions = { ...RemediationListActionsApi };
