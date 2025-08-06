import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { FunctionNode } from "../models/dashboard.models";

const CyberResylienceActionsApi = createActionGroup({
  source: "Cyber Resilience Page Action API",
  events: {
    "Get All ship Functions": emptyProps(),
    "Get All ship Functions Success": props<{
      allShipFunctions: FunctionNode[];
    }>(),
    "Error Get All ship Functions": props<{ error: string }>(),
    "All ship Functions Reset": emptyProps(),
  },
});

export const shipFunctionsActions = { ...CyberResylienceActionsApi };
