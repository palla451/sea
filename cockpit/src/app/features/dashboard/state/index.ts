import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { shipFunctionsActions } from "./actions";
import { FunctionNode } from "../models/dashboard.models";

interface ShipFunctionsState {
  shipFunctions: FunctionNode[];
}

const initialState: ShipFunctionsState = {
  shipFunctions: [],
};

export const shipFunctionsFeature = createFeature({
  name: "shipFunctions",
  reducer: createReducer(
    initialState,
    on(
      shipFunctionsActions.getAllShipFunctionsSuccess,
      shipFunctionsActions.errorGetAllShipFunctions,
      (state, action): ShipFunctionsState => ({
        ...state,
        shipFunctions:
          action.type ===
          "[Cyber Resilience Page Action API] Get All ship Functions Success"
            ? action.allShipFunctions
            : [],
      })
    )
  ),
});

const { selectShipFunctions } = shipFunctionsFeature;

export const fromCyberResilience = {
  selectShipFunctions,
};

export const selectAllVesselMacroFunctions = createSelector(
  fromCyberResilience.selectShipFunctions,
  (shipFunctions: FunctionNode[] = []) =>
    shipFunctions.filter((shipFunction) => !shipFunction.parent)
);

function collectAllDescendantIds(fn: FunctionNode): number[] {
  const result: number[] = [];
  const stack: FunctionNode[] = [...(fn.children || [])];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current) {
      result.push(current.id);
      if (current.children) {
        stack.push(...current.children);
      }
    }
  }

  return result;
}

export const selectFunctionIdsGroupedByMacroFunction = createSelector(
  fromCyberResilience.selectShipFunctions,
  (shipFunctions: FunctionNode[] = []) => {
    const macroFunctions = shipFunctions.filter((f) => !f.parent);

    return macroFunctions
      .map((macro) => ({
        macroFunctionId: macro.id,
        macroFunctionName: macro.name,
        functionIds: collectAllDescendantIds(macro),
      }))
      .filter((group) => group.functionIds.length > 0);
  }
);
