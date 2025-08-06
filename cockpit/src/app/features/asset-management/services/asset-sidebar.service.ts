import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject, tap } from "rxjs";
import { Asset } from "../../../core/models/asset.model";

export interface AssetsTableColumns {
  field: string;
  header: string;
  visible: boolean;
  sortable: boolean;
}
@Injectable({
  providedIn: "root",
})
export class AssetSidebarService {
  private _assetListSubject = new BehaviorSubject<Asset[]>([]);
  assetListSubject = this._assetListSubject.asObservable();

  _appliedFiltersAmountSubject = new BehaviorSubject<number>(0);
  appliedFiltersAmountSubject =
    this._appliedFiltersAmountSubject.asObservable();

  private resetSubject = new Subject<void>();
  resetTriggered = this.resetSubject.asObservable();

  private filtersSubject = new BehaviorSubject<any>({});
  currentFilters = this.filtersSubject.asObservable();

  private initialAssetsTableColumnConfig: AssetsTableColumns[] = [
    {
      field: "markPiece",
      header: "MARK PIECE",
      visible: true,
      sortable: false,
    },
    {
      field: "type",
      header: "Description",
      visible: true,
      sortable: true,
    },
    {
      field: "name",
      header: "NAME",
      visible: true,
      sortable: true,
    },

    {
      field: "status",
      header: "STATUS",
      visible: true,
      sortable: true,
    },
    {
      field: "editModal",
      header: "",
      visible: true,
      sortable: false,
    },
  ];

  private visibleColumnsSubject = new BehaviorSubject<AssetsTableColumns[]>(
    this.initialAssetsTableColumnConfig
  );
  visibleColumns$ = this.visibleColumnsSubject.asObservable();

  updateVisibleColumns(selectedColumns: AssetsTableColumns[]) {
    let newAssetsTBColumnsConfig: AssetsTableColumns[] = [
      ...this.initialAssetsTableColumnConfig,
    ];

    const recalculatedConfig = newAssetsTBColumnsConfig.map(
      (assetsTBColumnConfig) => {
        let calculatedAssetsTBColumnConfig: AssetsTableColumns;
        if (
          selectedColumns.some(
            (selectedColum) =>
              selectedColum.field === assetsTBColumnConfig.field
          )
        ) {
          calculatedAssetsTBColumnConfig = {
            ...assetsTBColumnConfig,
            visible: true,
          };
        } else {
          calculatedAssetsTBColumnConfig = {
            ...assetsTBColumnConfig,
            visible: false,
          };
        }

        return calculatedAssetsTBColumnConfig;
      }
    );

    newAssetsTBColumnsConfig = [...recalculatedConfig];
    this.visibleColumnsSubject.next(newAssetsTBColumnsConfig);
  }

  resetVisibleColumnsInitialConfig() {
    this.visibleColumnsSubject.next(this.initialAssetsTableColumnConfig);
  }

  getInitialColumnsConfig(): AssetsTableColumns[] {
    return this.initialAssetsTableColumnConfig;
  }

  updateAppliedFiltersCount(currentActiveFiltersCount: number) {
    this._appliedFiltersAmountSubject.next(currentActiveFiltersCount);
  }

  resetFiltersCount(): void {
    this._appliedFiltersAmountSubject.next(0);
  }

  updateAssetList(newAssetList: any) {
    this._assetListSubject.next(newAssetList);
  }

  getAssetsMarkPiecesOptions(): Observable<string[]> {
    return this.assetListSubject.pipe(
      map((assets) => {
        if (!Array.isArray(assets)) return [];

        return assets
          .map((asset) => asset?.pieceMark) // Estrai le descrizioni
          .filter((desc): desc is string => !!desc) // Filtra valori null/undefined
          .filter((desc, index, array) => array.indexOf(desc) === index); // Rimuovi duplicati
      })
    );
  }

  getAssetsDescriptionOptions(): Observable<string[]> {
    return this.assetListSubject.pipe(
      map((assets) => {
        if (!Array.isArray(assets)) return [];

        return assets
          .map((asset) => asset?.type) // Estrai le descrizioni
          .filter((desc): desc is string => !!desc) // Filtra valori null/undefined
          .filter((desc, index, array) => array.indexOf(desc) === index); // Rimuovi duplicati
      })
    );
  }

  getAssetsNameOptions(): Observable<string[]> {
    return this.assetListSubject.pipe(
      map((assets) => {
        if (!Array.isArray(assets)) return [];

        return assets
          .map((asset) => asset?.name) // Estrai le descrizioni
          .filter((desc): desc is string => !!desc) // Filtra valori null/undefined
          .filter((desc, index, array) => array.indexOf(desc) === index); // Rimuovi duplicati
      })
    );
  }

  updateFilters(newFilters: any) {
    this.filtersSubject.next(newFilters);
  }

  triggerReset() {
    this.resetSubject.next();
    this.resetFiltersCount();
    //this.updateFilters(null);
  }
}
