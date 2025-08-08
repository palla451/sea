import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable } from "rxjs";
import { FunctionNode } from "../models/dashboard.models";
import { isNonNull } from "../../../core/utils/rxjs-operators/noNullOperator";

@Injectable({
  providedIn: "root",
})
export class CyberResilienceOVManagerService {
  private _selectedCyberResiliencePerformance$ =
    new BehaviorSubject<FunctionNode | null>(null);
  selectedCyberResiliencePerformance$ =
    this._selectedCyberResiliencePerformance$.asObservable();

  private _cyberPerformancesList$ = new BehaviorSubject<FunctionNode[] | null>(
    null
  );
  cyberPerformancesList$ = this._cyberPerformancesList$.asObservable();

  updateSelectedCRPerformance(newSelectedPerformance: FunctionNode) {
    this._selectedCyberResiliencePerformance$.next(newSelectedPerformance);
  }

  updateCyberPerformancesList(newCyberPerformanceList: FunctionNode[]) {
    this._cyberPerformancesList$.next(newCyberPerformanceList);
  }

  /**
   * Emette il numero totale di asset 'Compromised'
   */
  countCompromisedAssets$(): Observable<number> {
    return this.selectedCyberResiliencePerformance$.pipe(
      map((root) => this.countUniqueAssetsByState(root, "Compromised"))
    );
  }

  /**
   * Emette il numero totale di asset 'Operational'
   */
  countOperationalAssets$(): Observable<number> {
    return this.selectedCyberResiliencePerformance$.pipe(
      map((root) => this.countUniqueAssetsByState(root, "Operational"))
    );
  }

  /**
   * Metodo privato ricorsivo per contare gli asset in base allo stato
   */
  // private countAssetsByState(node: FunctionNode | null, state: string): number {
  //   if (!node) return 0;

  //   let count = 0;

  //   if (node.assets?.length) {
  //     count += node.assets.filter((asset) => asset.status === state).length;
  //   }

  //   if (node.children?.length) {
  //     for (const child of node.children) {
  //       count += this.countAssetsByState(child, state);
  //     }
  //   }

  //   return count;
  // }


  private countUniqueAssetsByState(node: FunctionNode | null, state: string): number {
    if (!node) return 0;

    const uniquePieceMarks = new Set<string>();

    function processNode(currentNode: FunctionNode) {
        if (currentNode.assets?.length) {
            currentNode.assets.forEach(asset => {
                if (asset.status === state && asset.pieceMark) {
                    uniquePieceMarks.add(asset.pieceMark);
                }
            });
        }

        if (currentNode.children?.length) {
            currentNode.children.forEach(child => processNode(child));
        }
    }

    processNode(node);

    return uniquePieceMarks.size;
}
}
