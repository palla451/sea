import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { map, Observable, of } from "rxjs";
import { Asset, AssetReq, AssetRequest, AssetResponse } from "../../../core/models/asset.model";
import { environment } from "../../../../environments/environment";
import { API_ENDPOINTS } from "../../../../environments/api-endpoints";
@Injectable({
  providedIn: "root",
})
export class AssetManagementService {
  private apiService = inject(ApiService);
  mockedAssetArray: Asset[] = [
    {
      id: 1,
      pieceMark: "A123",
      type: "PLC",
      systemInfo: "System Alpha",
      deck: 3,
      mvz: 2,
      frame: 5,
      position: "CL",
      room: "12",
      cabinet: "54",
      status: "Turned Off",
      name: "Asset1",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 2,
      pieceMark: "B234",
      type: "Workstation",
      systemInfo: "System Beta",
      deck: 2,
      mvz: 1,
      frame: 4,
      position: "SB",
      room: "8",
      cabinet: "23",
      status: "Maintenance",
      name: "Asset2",
      functions: [
        {
          id: 201,
          name: "Process Control",
          operatingPercentage: 100,
        },
      ],
      creationDate: "2025-04-18",
      updateDate: "2025-05-05",
    },
    {
      id: 3,
      pieceMark: "C345",
      type: "SERVER",
      systemInfo: "System Gamma",
      deck: 4,
      mvz: 3,
      frame: 6,
      position: "PS",
      room: "15",
      cabinet: "33",
      status: "Operational",
      name: "Asset3",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 4,
      pieceMark: "D456",
      type: "SW",
      systemInfo: "System Delta",
      deck: 1,
      mvz: 1,
      frame: 2,
      position: "CL",
      room: "2",
      cabinet: "10",
      status: "Compromised",
      name: "Asset4",
      functions: [
        {
          id: 202,
          name: "Network Monitoring",
          operatingPercentage: 90,
        },
      ],
      creationDate: "2025-04-18",
    },
    {
      id: 5,
      pieceMark: "E567",
      type: "FW",
      systemInfo: "System Epsilon",
      deck: 5,
      mvz: 4,
      frame: 7,
      position: "CL",
      room: "18",
      cabinet: "77",
      status: "Maintenance",
      name: "Asset5",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 6,
      pieceMark: "F678",
      type: "PLC",
      systemInfo: "System Zeta",
      deck: 3,
      mvz: 2,
      frame: 5,
      position: "SB",
      room: "11",
      cabinet: "60",
      status: "Operational",
      name: "Asset6",
      functions: [
        {
          id: 203,
          name: "Power Control",
          operatingPercentage: 100,
        },
      ],
      creationDate: "2025-04-18",
    },
    {
      id: 7,
      pieceMark: "G789",
      type: "SERVER",
      systemInfo: "System Theta",
      deck: 2,
      mvz: 3,
      frame: 3,
      position: "CL",
      room: "10",
      cabinet: "30",
      status: "Maintenance",
      name: "Asset7",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 8,
      pieceMark: "H890",
      type: "Workstation",
      systemInfo: "System Iota",
      deck: 1,
      mvz: 2,
      frame: 2,
      position: "SB",
      room: "3",
      cabinet: "12",
      status: "Operational",
      name: "Asset8",
      functions: [
        {
          id: 204,
          name: "Data Entry",
          operatingPercentage: 95,
        },
      ],
      creationDate: "2025-04-18",
      updateDate: "2025-05-06",
    },
    {
      id: 9,
      pieceMark: "I901",
      type: "SW",
      systemInfo: "System Kappa",
      deck: 3,
      mvz: 2,
      frame: 5,
      position: "PS",
      room: "7",
      cabinet: "18",
      status: "Compromised",
      name: "Asset9",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 10,
      pieceMark: "J012",
      type: "FW",
      systemInfo: "System Lambda",
      deck: 4,
      mvz: 3,
      frame: 6,
      position: "CL",
      room: "20",
      cabinet: "42",
      status: "Turned Off",
      name: "Asset10",
      functions: [
        {
          id: 205,
          name: "Traffic Filter",
          operatingPercentage: 100,
        },
      ],
      creationDate: "2025-04-18",
    },
    {
      id: 11,
      pieceMark: "K123",
      type: "PLC",
      systemInfo: "System Mu",
      deck: 5,
      mvz: 4,
      frame: 8,
      position: "SB",
      room: "21",
      cabinet: "55",
      status: "Operational",
      name: "Asset11",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 12,
      pieceMark: "L234",
      type: "Workstation",
      systemInfo: "System Nu",
      deck: 1,
      mvz: 1,
      frame: 1,
      position: "CL",
      room: "1",
      cabinet: "3",
      status: "Turned Off",
      name: "Asset12",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 13,
      pieceMark: "M345",
      type: "SERVER",
      systemInfo: "System Xi",
      deck: 2,
      mvz: 2,
      frame: 4,
      position: "PS",
      room: "13",
      cabinet: "22",
      status: "Maintenance",
      name: "Asset13",
      functions: [
        {
          id: 206,
          name: "VM Hosting",
          operatingPercentage: 85,
        },
      ],
      creationDate: "2025-04-18",
    },
    {
      id: 14,
      pieceMark: "N456",
      type: "SW",
      systemInfo: "System Omicron",
      deck: 3,
      mvz: 3,
      frame: 6,
      position: "SB",
      room: "16",
      cabinet: "31",
      status: "Compromised",
      name: "Asset14",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 15,
      pieceMark: "O567",
      type: "FW",
      systemInfo: "System Pi",
      deck: 4,
      mvz: 4,
      frame: 7,
      position: "CL",
      room: "14",
      cabinet: "28",
      status: "Turned Off",
      name: "Asset15",
      functions: [],
      creationDate: "2025-04-18",
    },
    {
      id: 16,
      pieceMark: "P678",
      type: "PLC",
      systemInfo: "System Rho",
      deck: 5,
      mvz: 5,
      frame: 9,
      position: "SB",
      room: "19",
      cabinet: "44",
      status: "Operational",
      name: "Asset16",
      functions: [
        {
          id: 207,
          name: "Temperature Regulation",
          operatingPercentage: 100,
        },
      ],
      creationDate: "2025-04-18",
    },
  ];

  mockedUpdateAssetResponse: AssetResponse = {
    assets: this.mockedAssetArray
  };
  
  getAssets(): Observable<any[]> {
    if (environment.isMockActive) {
      return of(this.mockedAssetArray);
    } else {
      const apiurl = API_ENDPOINTS["retrieve_asset"];
      return this.apiService.get<AssetResponse>(apiurl).pipe(
        map(assetResponse => assetResponse.assets)
      );
    }
  }

   patchAsset(newAssetState: Asset): Observable<AssetResponse> {
     if (environment.isMockActive) {
      return of(this.mockedUpdateAssetResponse);
    } else {
      const apiurl = API_ENDPOINTS["update_asset_status"];
      const newUpdateAssetReq: AssetReq = {
        pieceMark: newAssetState?.pieceMark,
        status: newAssetState?.status
      }

      const newUdatedAssetReqArr: AssetReq[] = [newUpdateAssetReq];
      const newPatchAssetReq: AssetRequest = {
        assets: newUdatedAssetReqArr
      };

      return this.apiService.patch<AssetResponse>(apiurl,newPatchAssetReq);
    }
  }
}
