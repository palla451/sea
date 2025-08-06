import { createFeature, createReducer, on } from "@ngrx/store";
import { RemediationItem } from "../models/remediation-management.models";
import { incidentRemediationsActions } from "./actions";

/**
 * Remediation list
 */

export interface IncidentRemediationsState {
  allRemediations: RemediationItem[] | null;
}

const initialIncidentRemediationsState: IncidentRemediationsState = {
  allRemediations: null,
};

export const incidentRemediationsFeature = createFeature({
  name: "remediations",
  reducer: createReducer(
    initialIncidentRemediationsState,
    on(
      incidentRemediationsActions.getAllRemediationsSuccess,
      (state, action): IncidentRemediationsState => ({
        ...state,
        allRemediations:
          action.type ===
          "[Remediation List Page Action API] Get All Remediations Success"
            ? action.allRemediations
            : null,
      })
    ),
    on(
      incidentRemediationsActions.allRemediationsReset,
      incidentRemediationsActions.errorGetAllRemediations,
      (state, _): IncidentRemediationsState => ({
        ...state,
        allRemediations: null,
      })
    )
  ),
});

const { selectAllRemediations } = incidentRemediationsFeature;

export const fromIncidentRemediations = {
  selectAllRemediations,
};
