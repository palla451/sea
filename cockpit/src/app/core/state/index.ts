import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import {
  assetActions,
  calculateOperatingPercentageActions,
  dashboardCoreActions,
  incidentDetailActions,
  IncidentManagementActions,
  markEventFalsePositiveActions,
  messageActions,
  shipFunctionsByAssetActions,
} from "./actions";
import { ToastMessage } from "../models/toastMessage.model";
import {
  IncidentDetailAsset,
  DeckAssets,
  IncidentDetail,
  IncidentTimelineAssetsModal,
  IncidentTimelineEvents,
  IncidentTimelineEventsModal,
  IncidentEvent,
  ShipFunction,
} from "../../features/incident-detail/models/incident-detail.models";
import { Asset } from "../models/asset.model";
import { IncidentStatusesEnum } from "../enums/incident-statuses.enum";
import { Incident } from "../../features/dashboard/models/dashboard.models";
import { IncidentManageAction } from "../models/incident-management-modal.model";
import {
  CurrentStepAsset,
  RemediationImpact,
} from "../models/remediation-impact.model";
import { MarkEventAsFalsePositiveResponse } from "../models/mark-event-as-false-positive.model";
import { ManageIncidentStatesEnum } from "../enums/manage-incident-states.enum";
import { IconEventPathMap } from "../models/iconDictionary.model";

interface MessageState {
  messages: ToastMessage[];
}

const initialState: MessageState = {
  messages: [],
};

export interface IncidentDecks {
  number: string;
  svg: string;
}

interface AssetsState {
  assets: Asset[];
}

const initialAssetsState: AssetsState = {
  assets: [],
};

export const messageFeature = createFeature({
  name: "message",
  reducer: createReducer(
    initialState,
    on(
      messageActions.setMessage,
      (state, { message }): MessageState => ({
        ...state,
        messages: [...state.messages, message],
      })
    ),
    on(messageActions.removeMessage, (state, { id }) => ({
      ...state,
      messages: [...state.messages.filter((msg) => String(msg.id) !== id)],
    }))
  ),
  extraSelectors: ({ selectMessages }) => ({
    selectMessageById: (id: string) =>
      createSelector(selectMessages, (messages) =>
        messages.map((message) => message.id === id)
      ),
  }),
});

const { selectMessages, selectMessageById } = messageFeature;

export const fromMessage = { selectMessages, selectMessageById };

/**
 * Incident Detail
 */
export interface IncidentDetailState {
  incidentDetailBundle: IncidentDetail[];
}

const IncidentDetailInitialState: IncidentDetailState = {
  incidentDetailBundle: [],
};

export const incidentDetailFeature = createFeature({
  name: "incident-detail",
  reducer: createReducer(
    IncidentDetailInitialState,
    on(
      incidentDetailActions.getAllIncidentDetailSuccess,
      (state, action): IncidentDetailState => ({
        ...state,
        incidentDetailBundle:
          action.type ===
          "[Incident Detail Page Action API] Get All Incident Detail Success"
            ? action?.incidentDetailBundle
            : [],
      })
    ),
    on(
      incidentDetailActions.errorGetAllIncidentDetail,
      incidentDetailActions.getAllIncidentDetailReset,
      (state): IncidentDetailState => ({
        ...state,
        incidentDetailBundle: [],
      })
    )
  ),
});

const { selectIncidentDetailBundle } = incidentDetailFeature;

export const fromIncidentDetail = { selectIncidentDetailBundle };

export const selectAssetsGroupedByDeck = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): DeckAssets[] => {
    return (
      incidentDetails?.reduce<DeckAssets[]>((acc, incident) => {
        incident.events?.forEach((event) => {
          event.remediation?.actions?.forEach((action) => {
            if (action.asset) {
              const deck = action.asset.deck || "unknown";
              let deckGroup = acc.find((group) => group.deck === deck);

              if (!deckGroup) {
                deckGroup = { deck, assets: [] };
                acc.push(deckGroup);
              }

              deckGroup.assets.push(action.asset);
            }
          });
        });
        return acc;
      }, []) || []
    );
  }
);

export const selectAllIncidentDecks = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): DeckAssets[] => {
    return (
      incidentDetails?.reduce<DeckAssets[]>((acc, incident) => {
        incident.events?.forEach((event) => {
          event.remediation?.actions?.forEach((action) => {
            if (action.asset) {
              const deck = action.asset.deck || "unknown";
              let deckGroup = acc.find((group) => group.deck === deck);

              if (!deckGroup) {
                deckGroup = { deck, assets: [] };
                acc.push(deckGroup);
              }

              deckGroup.assets.push(action.asset);
            }
          });
        });
        return acc;
      }, []) || []
    );
  }
);

export const selectUniqueDecks = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): IncidentDecks[] => {
    if (!incidentDetails || !incidentDetails.length) return [];

    const deckSet = incidentDetails.reduce((set, incident) => {
      incident.events?.forEach((event) => {
        event.remediation?.actions?.forEach((action) => {
          if (action?.asset?.deck) {
            set.add(action.asset.deck);
          }
        });
      });
      return set;
    }, new Set<string>());

    return Array.from(deckSet)
      .sort()
      .map((deckNr) => {
        const deckSelOpt: IncidentDecks = {
          number: deckNr,
          svg: "",
        };

        return deckSelOpt;
      });
  }
);

export const selectEventsIncidentTimeline = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (timelineEvent): IncidentTimelineEvents[] => {
    if (!timelineEvent || timelineEvent.length === 0) return [];

    let iconCounter = 1;
    return timelineEvent.reduce((acc, incident) => {
      const events = incident.events ?? [];

      events?.forEach((event) => {
        const assetId =
          event?.remediation?.actions?.find(
            (action) => action.asset?.id != null
          )?.asset.id ?? null;

        const [creationDate, timePart] = event.creationDate.split("T");
        const creationTime = timePart?.substring(0, 8) ?? "";

        acc.push({
          id: event.id,
          name: event.name,
          description: event.description,
          type: event.type,
          eventDate: event.eventDate,
          creationDate,
          creationTime,
          assetId,
          icon: iconCounter.toString(),
        });

        iconCounter++;
      });

      return acc;
    }, [] as IncidentTimelineEvents[]);
  }
);

export const selectEventsIncidentTimelineModal = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  selectEventsIncidentTimeline,
  (timelineEvent, events): IncidentTimelineEventsModal[] => {
    if (!timelineEvent || timelineEvent.length === 0 || events.length === 0)
      return [];

    const allAssets: IncidentDetailAsset[] = timelineEvent.reduce(
      (acc, incident) => {
        if (!incident.events) return acc;

        incident.events?.forEach((event) => {
          event.remediation?.actions?.forEach((action) => {
            if (action.asset) {
              acc.push(action.asset);
            }
          });
        });

        return acc;
      },
      [] as IncidentDetailAsset[]
    );

    return events.map((event) => {
      const asset = allAssets.find((a) => a.id === event.assetId) ?? null;

      const assetModal: IncidentTimelineAssetsModal | null = asset
        ? {
            ipAddress: asset.ipAddress ?? '',
            macAddress: asset.macAddress,
            assetRole: asset.assetRole,
          }
        : null;

      return {
        event,
        asset: assetModal,
      };
    });
  }
);

export const selectAllAssetsInvolved = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): IncidentDetailAsset[] => {
    if (!incidentDetails) return [];

    const assetMap = new Map<number, IncidentDetailAsset>();

    incidentDetails?.forEach((incident) => {
      incident.events?.forEach((event) => {
        event.remediation?.actions?.forEach((action) => {
          const asset = action.asset;
          if (asset && !assetMap.has(asset.externalAssetId)) {
            assetMap.set(asset.externalAssetId, asset);
          }
        });
      });
    });

    return Array.from(assetMap.values());
  }
);

export const selectCurrentIncidentSeverity = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): string => {
    if (!incidentDetails || !incidentDetails.length) return "";

    return incidentDetails[0]?.severity;
  }
);

export const selectEvents = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentList): IncidentEvent[] => {
    if (!incidentList || !incidentList.length) return [];

    return incidentList.flatMap((incident) => incident.events || []);
  }
);

export const selectAllActionDescriptions = createSelector(
  selectEvents,
  (events): string[] => {
    if (!events?.length) return [];

    return events.flatMap(
      (event) =>
        event.remediation?.actions?.map((action) => action.description) || []
    );
  }
);

export const selectAllCurrentIncidentEventsStatusIcon = createSelector(
  selectEvents,
  (events): string[] => {
    if (!events?.length) return [];

    return events.flatMap(
      (event) => IconEventPathMap[event.status?.toLowerCase()] ?? []
    );
  }
);

// Selector che estrae le ShipFunction uniche dal primo incident
export const selectUniqueShipFunctionsFromFirstIncident = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidents: IncidentDetail[]): ShipFunction[] => {
    if (!incidents || incidents.length === 0) return [];

    const firstIncident = incidents[0];

    const allFunctions: ShipFunction[] = firstIncident.events.flatMap(
      (event) =>
        event.remediation?.actions?.flatMap(
          (action) => action.asset?.shipFunctions ?? []
        ) ?? []
    );

    // Rimuove duplicati basandosi sul campo `function`
    const uniqueFunctionsMap = new Map<string, ShipFunction>();
    for (const func of allFunctions) {
      if (!uniqueFunctionsMap.has(func.function)) {
        uniqueFunctionsMap.set(func.function, func);
      }
    }

    return Array.from(uniqueFunctionsMap.values());
  }
);

/**
 * selectors specifici legati agli stati dell incident
 * da utilizzare nell incident management
 */
export const selectCurrentIncidentStatus = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): string => {
    return incidentDetails[0]?.status;
  }
);

export const selectIfCurrentIncidentIsNew = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): boolean => {
    return (
      incidentDetails[0]?.status.toLowerCase() ===
      ManageIncidentStatesEnum.INCIDENT_NEW
    );
  }
);

export const selectIfCurrentIncidentIsClosed = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): boolean => {
    return (
      incidentDetails[0]?.status.toLowerCase() ===
      ManageIncidentStatesEnum.INCIDENT_CLOSED
    );
  }
);

export const selectIfCurrentIncidentIsFalsePositive = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): boolean => {
    return (
      incidentDetails[0]?.status.toLowerCase() ===
      ManageIncidentStatesEnum.INCIDENT_FALSE_POSITIVE
    );
  }
);

export const selectCurrentIncidentEventsStatuses = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidentDetails): string[] => {
    return incidentDetails[0]?.events.map((event) =>
      event.status.toLowerCase()
    );
  }
);

// Selettore base per la lista degli incidenti
export const selectFirstIncident = createSelector(
  fromIncidentDetail.selectIncidentDetailBundle,
  (incidents) => incidents[0] // Prende il primo incidente
);

// Selettore che estrae lo status della remediation dell'evento i-esimo
export const selectRemediationStatusByEventIndex = (i: number) =>
  createSelector(selectFirstIncident, (firstIncident) => {
    if (
      !firstIncident ||
      !firstIncident.events ||
      i >= firstIncident.events.length
    ) {
      return null; // Gestione casi fuori range o dati mancanti
    }
    return firstIncident.events[i]?.remediation?.status.toLowerCase(); // Status della remediation
  });

// Selettore che restituisce l'array di status delle actions dell'evento i-esimo
export const selectActionStatusesByEventIndex = (i: number) =>
  createSelector(selectFirstIncident, (firstIncident) => {
    if (
      !firstIncident ||
      !firstIncident.events ||
      i >= firstIncident.events.length ||
      !firstIncident.events[i]?.remediation?.actions
    ) {
      return []; // Restituisce array vuoto se dati mancanti o indice non valido
    }

    // Mappa gli status delle actions
    return firstIncident.events[i].remediation.actions.map((action) =>
      action.status.toLowerCase()
    );
  });

/**
 * Dashboard
 */
export interface DashboardCoreState {
  allIncidentsList: Incident[] | null;
}

const initialDashboardState: DashboardCoreState = {
  allIncidentsList: null,
};

/**
 * Incidents
 */
export const dashboardCoreFeature = createFeature({
  name: "dashboard",
  reducer: createReducer(
    initialDashboardState,
    on(
      dashboardCoreActions.getAllIncidentsListSuccess,
      (state, action): DashboardCoreState => ({
        ...state,
        allIncidentsList:
          action.type ===
          "[Dashboard Page Action API] Get All Incidents List Success"
            ? action.allIncidentsList
            : null,
      })
    ),
    on(
      dashboardCoreActions.allIncidentsListReset,
      dashboardCoreActions.errorGetAllIncidentsList,
      (state, _): DashboardCoreState => ({
        ...state,
        allIncidentsList: [],
      })
    )
  ),
});

const { selectAllIncidentsList } = dashboardCoreFeature;

export const fromDashboardCore = {
  selectAllIncidentsList,
};

/**
 * Events from incident id's
 */
export const selectEventsById = (incidentId: number) =>
  createSelector(
    fromIncidentDetail.selectIncidentDetailBundle,
    (incidentList): IncidentEvent[] => {
      if (!incidentList || !incidentList.length) return [];

      // Trova l'incident con l'id specificato
      const incident = incidentList.find(
        (incident) => incident.id === incidentId
      );
      return incident?.events || [];
    }
  );

/**
 * This selector feeds History page
 */
export const selectAllClosedIncidentForHistoryPage = createSelector(
  fromDashboardCore.selectAllIncidentsList,
  (allIncidents): Incident[] => {
    if (!allIncidents) return [];

    const closedIncidents = allIncidents.filter(
      (incident) =>
        incident?.status === IncidentStatusesEnum.FALSE_POSITIVE ||
        incident?.status === IncidentStatusesEnum.CLOSED
    );

    return closedIncidents;
  }
);

/**
 * This selector feeds Incident page
 */
export const selectAllOpenIncidentForIncidentPage = createSelector(
  fromDashboardCore.selectAllIncidentsList,
  (allIncidents): Incident[] => {
    if (!allIncidents) return [];

    const openIncidents = allIncidents.filter(
      (incident) => incident?.status === IncidentStatusesEnum.NEW
    );

    return openIncidents;
  }
);

/**
 * Assets Management page
 */

export const assetsFeature = createFeature({
  name: "assets",
  reducer: createReducer(
    initialAssetsState,
    on(
      assetActions.getAllAssetsListSuccess,
      assetActions.errorGetAllAssetsList,
      (state, action): AssetsState => ({
        ...state,
        assets:
          action.type ===
          "[Asset Management Page Action API] Get All Assets List Success"
            ? action.allAssetsList
            : [],
      })
    )
  ),
});

const { selectAssets } = assetsFeature;

export const selectAllAssets = { selectAssets };

export const selectMaintenanceAssetsCount = createSelector(
  selectAssets,
  (assets: Asset[]) =>
    assets.filter((asset) => asset.status?.toLowerCase() === "maintenance")
      .length
);

export const selectOperationalAssetsCount = createSelector(
  selectAssets,
  (assets: Asset[]) =>
    assets.filter((asset) => asset.status?.toLowerCase() === "operational")
      .length
);

export const selectTurnedOffAssetsCount = createSelector(
  selectAssets,
  (assets: Asset[]) =>
    assets.filter((asset) => asset.status?.toLowerCase() === "turned off")
      .length
);

export const selectCompromisedAssetsCount = createSelector(
  selectAssets,
  (assets: Asset[]) =>
    assets.filter((asset) => asset.status?.toLowerCase() === "compromised")
      .length
);

interface IncidentManageActionsState {
  actions: IncidentManageAction[];
  incidentId: number | undefined;
}

const initialActionsState: IncidentManageActionsState = {
  actions: [],
  incidentId: undefined,
};

export const updateIncidentManagementActionsFeature = createFeature({
  name: "incidentManagementActions",
  reducer: createReducer(
    initialActionsState,
    on(
      IncidentManagementActions.updateIncidentManagementActionsSuccess,
      (state, { actions, incidentId }) => ({
        ...state,
        actions,
        incidentId,
      })
    ),
    on(
      IncidentManagementActions.updateIncidentManagementActionsError,
      (state) => ({
        ...state,
        actions: [],
      })
    )
  ),
});
export const { selectActions: selectIncidentManagementActions } =
  updateIncidentManagementActionsFeature;

/**
 * Get All Ship Functions By Asset
 */

interface AllShipFunctionsByAssetState {
  shipFunctionsByAsset: RemediationImpact[];
}

const initialAllShipFunctsByAssetState: AllShipFunctionsByAssetState = {
  shipFunctionsByAsset: [],
};

export const getAllShipFunctsByAssetFeature = createFeature({
  name: "allShipFunctionsByAsset",
  reducer: createReducer(
    initialAllShipFunctsByAssetState,
    on(
      shipFunctionsByAssetActions.getAllShipFunctionsByAssetSuccess,
      shipFunctionsByAssetActions.errorGetAllShipFunctionsByAsset,
      (state, action): AllShipFunctionsByAssetState => ({
        ...state,
        shipFunctionsByAsset:
          action.type ===
          "[Remediation Management Modal Action API] Get All Ship Functions By Asset Success"
            ? action.allShipFunctsByAsset
            : [],
      })
    )
  ),
});

const { selectShipFunctionsByAsset } = getAllShipFunctsByAssetFeature;

export const selectAllFunctsByAsset = { selectShipFunctionsByAsset };

/**
 * Get Calculate Operating Percentage
 */

interface CalculateOperatingPercentageByAssetIpState {
  currentStepAsset: CurrentStepAsset[] | null;
}

const initialCalculateOperatingPercentage: CalculateOperatingPercentageByAssetIpState =
  {
    currentStepAsset: null,
  };

export const calculateOperatingPercentageFeature = createFeature({
  name: "calculateOpPercentage",
  reducer: createReducer(
    initialCalculateOperatingPercentage,
    on(
      calculateOperatingPercentageActions.getFunctionOperatingPercentageSuccess,
      calculateOperatingPercentageActions.errorGetFunctionOperatingPercentage,
      (state, action): CalculateOperatingPercentageByAssetIpState => ({
        ...state,
        currentStepAsset:
          action.type ===
          "[Remediation Management Modal Action API] Get Function Operating Percentage Success"
            ? action.currentStepAsset
            : null,
      })
    )
  ),
});

const { selectCurrentStepAsset } = calculateOperatingPercentageFeature;

export const selectCurrStepAsset = { selectCurrentStepAsset };

/**
 * Mark as False Positive Reducer
 */

interface MarkEventAsFalsePositiveState {
  markEventAsFalsePositiveResponse: MarkEventAsFalsePositiveResponse | null;
  incidentId: number | undefined;
}

const initialMarkEventAsFalsePositiveState: MarkEventAsFalsePositiveState = {
  markEventAsFalsePositiveResponse: null,
  incidentId: undefined,
};

export const markEventAsFalsePositiveFeature = createFeature({
  name: "markEventAsFalsePositive",
  reducer: createReducer(
    initialMarkEventAsFalsePositiveState,
    on(
      markEventFalsePositiveActions.markEventAsFalsePositiveActionsSuccess,
      (state, { markEventAsFalsePositiveResponse, incidentId }) => ({
        ...state,
        markEventAsFalsePositiveResponse,
        incidentId,
      })
    ),
    on(
      markEventFalsePositiveActions.markEventAsFalsePositiveActionsError,
      (state) => ({
        ...state,
        markEventAsFalsePositiveResponse: null,
        incidentId: undefined,
      })
    )
  ),
});

export const {
  selectMarkEventAsFalsePositiveResponse: selectMarkEventFalsePositiveActions,
} = markEventAsFalsePositiveFeature;
