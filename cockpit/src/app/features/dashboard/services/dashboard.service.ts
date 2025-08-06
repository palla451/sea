import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { map, Observable, of } from "rxjs";
import { HttpParams } from "@angular/common/http";
import {
  FunctionNode,
  Incident,
  mapSourceIncidentToIncident,
  SourceIncident,
  SourceIncidentResponse,
} from "../models/dashboard.models";
import { CyberResilienceResponse } from "../../../core/models/tree-view.models";
import { environment } from "../../../../environments/environment";
import { API_ENDPOINTS } from "../../../../environments/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiService = inject(ApiService);
  private mockedIncidents: SourceIncident[] = [
    {
      id: 123456789,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-01T09:15:00Z",
      creationDate: "2025-07-01T09:15:00Z",
      updateDate: "2025-07-01T09:15:00Z",
      assets: [
        { deck: "4", frame: "80", mvz: "2" },
        { deck: "5", frame: "142", mvz: "3" },
        { deck: "7", frame: "226", mvz: "4" },
      ],
    },
    {
      id: 987654321,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "3",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-11T14:30:00Z",
      creationDate: "2025-07-11T14:30:00Z",
      updateDate: "2025-07-11T14:30:00Z",
      assets: [
        { deck: "5", frame: "89", mvz: "2" },
        { deck: "9", frame: "147", mvz: "3" },
      ],
    },
    {
      id: 232425267,
      title: "Malaware detected on MF03",
      description: "Malaware detected on MF03",
      severity: "Medium",
      critically: "2",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-21T08:45:00Z",
      creationDate: "2025-07-21T08:45:00Z",
      updateDate: "2025-07-21T08:45:00Z",
      assets: [{ deck: "2", frame: "97", mvz: "2" }],
    },
    {
      id: 313233334,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "1",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-31T17:10:00Z",
      creationDate: "2025-07-31T17:10:00Z",
      updateDate: "2025-07-31T17:10:00Z",
      assets: [{ deck: "6", frame: "45", mvz: "1" }],
    },
    {
      id: 444546471,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-08-10T10:00:00Z",
      creationDate: "2025-08-10T10:00:00Z",
      updateDate: "2025-08-10T10:00:00Z",
      assets: [
        { deck: "3", frame: "212", mvz: "4" },
        { deck: "2", frame: "49", mvz: "1" },
        { deck: "7", frame: "141", mvz: "3" },
      ],
    },
    {
      id: 565758590,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "2",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-08-20T12:20:00Z",
      creationDate: "2025-08-20T12:20:00Z",
      updateDate: "2025-08-20T12:20:00Z",
      assets: [
        { deck: "4", frame: "72", mvz: "1" },
        { deck: "2", frame: "128", mvz: "2" },
        { deck: "7", frame: "185", mvz: "4" },
      ],
    },
    {
      id: 606162636,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "1",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-08-30T09:05:00Z",
      creationDate: "2025-08-30T09:05:00Z",
      updateDate: "2025-08-30T09:05:00Z",
      assets: [
        { deck: "5", frame: "82", mvz: "2" },
        { deck: "9", frame: "170", mvz: "3" },
      ],
    },
    {
      id: 717277787,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-09-09T16:40:00Z",
      creationDate: "2025-09-09T16:40:00Z",
      updateDate: "2025-09-09T16:40:00Z",
      assets: [{ deck: "6", frame: "190", mvz: "4" }],
    },
    {
      id: 999897969,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-09-19T11:55:00Z",
      creationDate: "2025-09-19T11:55:00Z",
      updateDate: "2025-09-19T11:55:00Z",
      assets: [
        { deck: "3", frame: "119", mvz: "3" },
        { deck: "5", frame: "30", mvz: "1" },
        { deck: "7", frame: "57", mvz: "1" },
      ],
    },
    {
      id: 557687891,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-09-29T15:30:00Z",
      creationDate: "2025-09-29T15:30:00Z",
      updateDate: "2025-09-29T15:30:00Z",
      assets: [
        { deck: "4", frame: "34", mvz: "1" },
        { deck: "5", frame: "21", mvz: "1" },
        { deck: "7", frame: "116", mvz: "2" },
      ],
    },
    {
      id: 647646468,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "3",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-10-09T07:45:00Z",
      creationDate: "2025-10-09T07:45:00Z",
      updateDate: "2025-10-09T07:45:00Z",
      assets: [
        { deck: "5", frame: "56", mvz: "1" },
        { deck: "9", frame: "89", mvz: "2" },
      ],
    },
    {
      id: 649646469,
      title: "Malaware detected on MF03",
      description: "Malaware detected on MF03",
      severity: "Medium",
      critically: "2",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-10-19T13:10:00Z",
      creationDate: "2025-10-19T13:10:00Z",
      updateDate: "2025-10-19T13:10:00Z",
      assets: [{ deck: "2", frame: "145", mvz: "3" }],
    },
    {
      id: 755787957,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "1",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-10-29T10:25:00Z",
      creationDate: "2025-10-29T10:25:00Z",
      updateDate: "2025-10-29T10:25:00Z",
      assets: [{ deck: "6", frame: "200", mvz: "4" }],
    },
    {
      id: 687684447,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-11-08T08:35:00Z",
      creationDate: "2025-11-08T08:35:00Z",
      updateDate: "2025-11-08T08:35:00Z",
      assets: [
        { deck: "3", frame: "112", mvz: "2" },
        { deck: "2", frame: "220", mvz: "4" },
        { deck: "7", frame: "59", mvz: "1" },
      ],
    },
    {
      id: 476757709,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "2",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-11-18T17:50:00Z",
      creationDate: "2025-11-18T17:50:00Z",
      updateDate: "2025-11-18T17:50:00Z",
      assets: [
        { deck: "4", frame: "37", mvz: "1" },
        { deck: "2", frame: "68", mvz: "1" },
        { deck: "7", frame: "83", mvz: "2" },
      ],
    },
    {
      id: 994553541,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "1",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-11-28T12:15:00Z",
      creationDate: "2025-11-28T12:15:00Z",
      updateDate: "2025-11-28T12:15:00Z",
      assets: [
        { deck: "5", frame: "39", mvz: "1" },
        { deck: "9", frame: "187", mvz: "3" },
      ],
    },
    {
      id: 665795352,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-12-08T09:30:00Z",
      creationDate: "2025-12-08T09:30:00Z",
      updateDate: "2025-12-08T09:30:00Z",
      assets: [{ deck: "6", frame: "165", mvz: "3" }],
    },
    {
      id: 346775754,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-12-18T14:45:00Z",
      creationDate: "2025-12-18T14:45:00Z",
      updateDate: "2025-12-18T14:45:00Z",
      assets: [
        { deck: "3", frame: "44", mvz: "1" },
        { deck: "5", frame: "73", mvz: "2" },
        { deck: "7", frame: "147", mvz: "3" },
      ],
    },
    {
      id: 123456790,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-07-01T09:15:00Z",
      creationDate: "2025-07-01T09:15:00Z",
      updateDate: "2025-07-01T09:15:00Z",
      assets: [
        { deck: "4", frame: "80", mvz: "2" },
        { deck: "5", frame: "142", mvz: "3" },
        { deck: "7", frame: "226", mvz: "4" },
      ],
    },
    {
      id: 987654323,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "3",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-07-11T14:30:00Z",
      creationDate: "2025-07-11T14:30:00Z",
      updateDate: "2025-07-11T14:30:00Z",
      assets: [
        { deck: "5", frame: "89", mvz: "2" },
        { deck: "9", frame: "147", mvz: "3" },
      ],
    },
    {
      id: 232425269,
      title: "Malaware detected on MF03",
      description: "Malaware detected on MF03",
      severity: "Medium",
      critically: "2",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-07-21T08:45:00Z",
      creationDate: "2025-07-21T08:45:00Z",
      updateDate: "2025-07-21T08:45:00Z",
      assets: [{ deck: "2", frame: "97", mvz: "2" }],
    },
    {
      id: 313233342,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "1",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-07-31T17:10:00Z",
      creationDate: "2025-07-31T17:10:00Z",
      updateDate: "2025-07-31T17:10:00Z",
      assets: [{ deck: "6", frame: "45", mvz: "1" }],
    },
    {
      id: 444546475,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-08-10T10:00:00Z",
      creationDate: "2025-08-10T10:00:00Z",
      updateDate: "2025-08-10T10:00:00Z",
      assets: [
        { deck: "3", frame: "212", mvz: "4" },
        { deck: "2", frame: "49", mvz: "1" },
        { deck: "7", frame: "141", mvz: "3" },
      ],
    },
    {
      id: 565758599,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "2",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-08-20T12:20:00Z",
      creationDate: "2025-08-20T12:20:00Z",
      updateDate: "2025-08-20T12:20:00Z",
      assets: [
        { deck: "4", frame: "72", mvz: "1" },
        { deck: "2", frame: "128", mvz: "2" },
        { deck: "7", frame: "185", mvz: "4" },
      ],
    },
    {
      id: 606162686,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "1",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-08-30T09:05:00Z",
      creationDate: "2025-08-30T09:05:00Z",
      updateDate: "2025-08-30T09:05:00Z",
      assets: [
        { deck: "5", frame: "82", mvz: "2" },
        { deck: "9", frame: "170", mvz: "3" },
      ],
    },
    {
      id: 717277790,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-09-09T16:40:00Z",
      creationDate: "2025-09-09T16:40:00Z",
      updateDate: "2025-09-09T16:40:00Z",
      assets: [{ deck: "6", frame: "190", mvz: "4" }],
    },
    {
      id: 999897988,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-09-19T11:55:00Z",
      creationDate: "2025-09-19T11:55:00Z",
      updateDate: "2025-09-19T11:55:00Z",
      assets: [
        { deck: "3", frame: "119", mvz: "3" },
        { deck: "5", frame: "30", mvz: "1" },
        { deck: "7", frame: "57", mvz: "1" },
      ],
    },
    {
      id: 557687855,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-09-29T15:30:00Z",
      creationDate: "2025-09-29T15:30:00Z",
      updateDate: "2025-09-29T15:30:00Z",
      assets: [
        { deck: "4", frame: "34", mvz: "1" },
        { deck: "5", frame: "21", mvz: "1" },
        { deck: "7", frame: "116", mvz: "2" },
      ],
    },
    {
      id: 647646490,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "3",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-10-09T07:45:00Z",
      creationDate: "2025-10-09T07:45:00Z",
      updateDate: "2025-10-09T07:45:00Z",
      assets: [
        { deck: "5", frame: "56", mvz: "1" },
        { deck: "9", frame: "89", mvz: "2" },
      ],
    },
    {
      id: 649646479,
      title: "Malaware detected on MF03",
      description: "Malaware detected on MF03",
      severity: "Medium",
      critically: "2",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-10-19T13:10:00Z",
      creationDate: "2025-10-19T13:10:00Z",
      updateDate: "2025-10-19T13:10:00Z",
      assets: [{ deck: "2", frame: "145", mvz: "3" }],
    },
    {
      id: 755787932,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "1",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-10-29T10:25:00Z",
      creationDate: "2025-10-29T10:25:00Z",
      updateDate: "2025-10-29T10:25:00Z",
      assets: [{ deck: "6", frame: "200", mvz: "4" }],
    },
    {
      id: 687684453,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-11-08T08:35:00Z",
      creationDate: "2025-11-08T08:35:00Z",
      updateDate: "2025-11-08T08:35:00Z",
      assets: [
        { deck: "3", frame: "112", mvz: "2" },
        { deck: "2", frame: "220", mvz: "4" },
        { deck: "7", frame: "59", mvz: "1" },
      ],
    },
    {
      id: 476757729,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "2",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-11-18T17:50:00Z",
      creationDate: "2025-11-18T17:50:00Z",
      updateDate: "2025-11-18T17:50:00Z",
      assets: [
        { deck: "4", frame: "37", mvz: "1" },
        { deck: "2", frame: "68", mvz: "1" },
        { deck: "7", frame: "83", mvz: "2" },
      ],
    },
    {
      id: 994553592,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "1",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-11-28T12:15:00Z",
      creationDate: "2025-11-28T12:15:00Z",
      updateDate: "2025-11-28T12:15:00Z",
      assets: [
        { deck: "5", frame: "39", mvz: "1" },
        { deck: "9", frame: "187", mvz: "3" },
      ],
    },
    {
      id: 665795362,
      title: "New USB detected on Radar console",
      description: "New USB detected on Radar console",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "False Positive",
      createdAt: "2025-12-08T09:30:00Z",
      creationDate: "2025-12-08T09:30:00Z",
      updateDate: "2025-12-08T09:30:00Z",
      assets: [{ deck: "6", frame: "165", mvz: "3" }],
    },
    {
      id: 346775782,
      title: "Network traffic linked to scanning activity",
      description: "Network traffic linked to scanning activity",
      severity: "Low",
      critically: "5",
      summary: "",
      tags: "",
      status: "Closed",
      createdAt: "2025-12-18T14:45:00Z",
      creationDate: "2025-12-18T14:45:00Z",
      updateDate: "2025-12-18T14:45:00Z",
      assets: [
        { deck: "3", frame: "44", mvz: "1" },
        { deck: "5", frame: "73", mvz: "2" },
        { deck: "7", frame: "147", mvz: "3" },
      ],
    },
  ];

  private mockedShipFunctions: CyberResilienceResponse = {
    functions: [
      {
        id: 110,
        name: "Power generation",
        description: "Power generation",
        operatingPercentage: 100,
        creationDate: "2025-05-09T13:55:08.912+00:00",
        assets: [],
      },
      {
        id: 111,
        name: "HVAC",
        description: "HVAC",
        operatingPercentage: 100,
        creationDate: "2025-05-09T14:05:55.746+00:00",
        assets: [],
      },
      {
        id: 112,
        name: "Navigation",
        description: "Navigation",
        operatingPercentage: 100,
        creationDate: "2025-05-09T14:07:12.314+00:00",
        assets: [],
      },
      {
        id: 105,
        name: "Propulsion",
        description: "Propulsion",
        operatingPercentage: 70,
        creationDate: "2025-04-17T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 106,
        parent: {
          id: 105,
          name: "Propulsion",
          description: "Propulsion",
          operatingPercentage: 70,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "Left Axis Line",
        description: "Left Axis Line",
        operatingPercentage: 90,
        creationDate: "2025-04-17T22:00:00.000+00:00",
        updateDate: "2025-05-09T16:23:41.567+00:00",
        assets: [],
      },
      {
        id: 107,
        parent: {
          id: 105,
          name: "Propulsion",
          description: "Propulsion",
          operatingPercentage: 70,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "Turbiner and Reducer Management",
        description: "Turbiner and Reducer Management",
        operatingPercentage: 37,
        creationDate: "2025-04-17T22:00:00.000+00:00",
        updateDate: "2025-05-09T16:23:41.571+00:00",
        assets: [],
      },
      {
        id: 109,
        parent: {
          id: 105,
          name: "Propulsion",
          description: "Propulsion",
          operatingPercentage: 70,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "Right Axis Line",
        description: "Right Axis Line",
        operatingPercentage: 63,
        creationDate: "2025-05-09T13:53:37.201+00:00",
        updateDate: "2025-05-09T14:20:05.847+00:00",
        assets: [],
      },
      {
        id: 119,
        parent: {
          id: 105,
          name: "Propulsion",
          description: "Propulsion",
          operatingPercentage: 70,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "Auxiliary Propulsion / Minor Equipment",
        description: "Auxiliary Propulsion / Minor Equipment",
        operatingPercentage: 90,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 108,
        parent: {
          id: 106,
          parent: {
            id: 105,
            name: "Propulsion",
            description: "Propulsion",
            operatingPercentage: 70,
            creationDate: "2025-04-17T22:00:00.000+00:00",
          },
          name: "Left Axis Line",
          description: "Left Axis Line",
          operatingPercentage: 90,
          creationDate: "2025-04-17T22:00:00.000+00:00",
          updateDate: "2025-05-09T16:23:41.567+00:00",
        },
        name: "SubFunction 1",
        description: "SubFunction 1",
        operatingPercentage: 76,
        creationDate: "2025-04-17T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 120,
        parent: {
          id: 106,
          parent: {
            id: 105,
            name: "Propulsion",
            description: "Propulsion",
            operatingPercentage: 70,
            creationDate: "2025-04-17T22:00:00.000+00:00",
          },
          name: "Left Axis Line",
          description: "Left Axis Line",
          operatingPercentage: 90,
          creationDate: "2025-04-17T22:00:00.000+00:00",
          updateDate: "2025-05-09T16:23:41.567+00:00",
        },
        name: "SubFunction 2",
        description: "SubFunction 2",
        operatingPercentage: 50,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 121,
        parent: {
          id: 108,
          parent: {
            id: 106,
            parent: {
              id: 105,
              name: "Propulsion",
              description: "Propulsion",
              operatingPercentage: 70,
              creationDate: "2025-04-17T22:00:00.000+00:00",
            },
            name: "Left Axis Line",
            description: "Left Axis Line",
            operatingPercentage: 90,
            creationDate: "2025-04-17T22:00:00.000+00:00",
            updateDate: "2025-05-09T16:23:41.567+00:00",
          },
          name: "SubFunction 1",
          description: "SubFunction 1",
          operatingPercentage: 76,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "SubFunction1.1",
        description: "SubFunction1.1",
        operatingPercentage: 70,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 122,
        parent: {
          id: 108,
          parent: {
            id: 106,
            parent: {
              id: 105,
              name: "Propulsion",
              description: "Propulsion",
              operatingPercentage: 70,
              creationDate: "2025-04-17T22:00:00.000+00:00",
            },
            name: "Left Axis Line",
            description: "Left Axis Line",
            operatingPercentage: 90,
            creationDate: "2025-04-17T22:00:00.000+00:00",
            updateDate: "2025-05-09T16:23:41.567+00:00",
          },
          name: "SubFunction 1",
          description: "SubFunction 1",
          operatingPercentage: 76,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "SubFunction1.2",
        description: "SubFunction1.2",
        operatingPercentage: 80,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 123,
        parent: {
          id: 108,
          parent: {
            id: 106,
            parent: {
              id: 105,
              name: "Propulsion",
              description: "Propulsion",
              operatingPercentage: 70,
              creationDate: "2025-04-17T22:00:00.000+00:00",
            },
            name: "Left Axis Line",
            description: "Left Axis Line",
            operatingPercentage: 90,
            creationDate: "2025-04-17T22:00:00.000+00:00",
            updateDate: "2025-05-09T16:23:41.567+00:00",
          },
          name: "SubFunction 1",
          description: "SubFunction 1",
          operatingPercentage: 76,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "SubFunction1.3",
        description: "SubFunction1.3",
        operatingPercentage: 90,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [],
      },
      {
        id: 124,
        parent: {
          id: 108,
          parent: {
            id: 106,
            parent: {
              id: 105,
              name: "Propulsion",
              description: "Propulsion",
              operatingPercentage: 70,
              creationDate: "2025-04-17T22:00:00.000+00:00",
            },
            name: "Left Axis Line",
            description: "Left Axis Line",
            operatingPercentage: 90,
            creationDate: "2025-04-17T22:00:00.000+00:00",
            updateDate: "2025-05-09T16:23:41.567+00:00",
          },
          name: "SubFunction 1",
          description: "SubFunction 1",
          operatingPercentage: 76,
          creationDate: "2025-04-17T22:00:00.000+00:00",
        },
        name: "SubFunction1.4",
        description: "SubFunction1.4",
        operatingPercentage: 66,
        creationDate: "2025-05-21T22:00:00.000+00:00",
        assets: [
          {
            pieceMark: "A1",
            status: "Operational",
            name: "A1",
          },
          {
            pieceMark: "A2",
            status: "Compromised",
            name: "A2",
          },
          {
            pieceMark: "A3",
            status: "Operational",
            name: "A3",
          },
          {
            pieceMark: "A4",
            status: "Maintenance",
            name: "A4",
          },
          {
            pieceMark: "A5",
            status: "Turned Off",
            name: "A5",
          },
        ],
      },
    ],
  };

  getRetrieveShipFunctions(): Observable<FunctionNode[]> {
    if (environment.isMockActive) {
      return of(this.mockedShipFunctions).pipe(
        map((response) => {
          const all = response.functions;

          // Costruzione lookup per referenziare ogni nodo per id
          const mapById = new Map<number, FunctionNode>();
          all?.forEach((fn) => {
            mapById.set(fn.id, { ...fn, children: [] });
          });

          const roots: FunctionNode[] = [];

          // Collegamento padre-figlio
          all?.forEach((fn) => {
            const currentNode = mapById.get(fn.id)!;

            if (fn.parent) {
              const parentNode = mapById.get(fn.parent.id);
              if (parentNode) {
                parentNode.children?.push(currentNode);
              }
            } else {
              roots.push(currentNode); // è una macrofunzione (non ha parent)
            }
          });

          return roots;
        })
      );
    } else {
      const apiurl = API_ENDPOINTS["retrieve_ship_functions"];
      return this.apiService.get<CyberResilienceResponse>(apiurl).pipe(
        map((response) => {
          const all = response.functions;

          // Costruzione lookup per referenziare ogni nodo per id
          const mapById = new Map<number, FunctionNode>();
          all?.forEach((fn) => {
            mapById.set(fn.id, { ...fn, children: [] });
          });

          const roots: FunctionNode[] = [];

          // Collegamento padre-figlio
          all?.forEach((fn) => {
            const currentNode = mapById.get(fn.id)!;

            if (fn.parent) {
              const parentNode = mapById.get(fn.parent.id);
              if (parentNode) {
                parentNode.children?.push(currentNode);
              }
            } else {
              roots.push(currentNode); // è una macrofunzione (non ha parent)
            }
          });

          return roots;
        })
      );
    }
  }

  getRetrieveIncident(statuses?: string): Observable<Incident[]> {
    let params = new HttpParams();
    if (statuses) {
      params = params.set("statuses", statuses);
    }

    if (environment.isMockActive) {
      const mappedSourceIncidents = this.mockedIncidents.map((incident) =>
        mapSourceIncidentToIncident(incident)
      );
      return of(mappedSourceIncidents);
    } else {
      const apiurl = API_ENDPOINTS["retrieve_incident"];
      return this.apiService.get<SourceIncidentResponse>(apiurl, params).pipe(
        map((sourceIncidentResponse) => sourceIncidentResponse?.incidents),
        map((sourceIncidents) => {
          const mappedIncidents: Incident[] = sourceIncidents.map(
            (sourceIncident) => {
              return mapSourceIncidentToIncident(sourceIncident);
            }
          );

          return mappedIncidents;
        })
      );
    }
  }
}
