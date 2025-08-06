import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { AccordionItem } from "../../../core/models/tree-view.models";

@Injectable({
  providedIn: "root",
})
export class CyberResilienceSidebarService {
  private _shipFunctionsSubject = new BehaviorSubject<AccordionItem[]>([]);
  shipFunctionsSubject = this._shipFunctionsSubject.asObservable();

  _appliedFiltersAmountSubject = new BehaviorSubject<number>(0);
  appliedFiltersAmountSubject =
    this._appliedFiltersAmountSubject.asObservable();

  private filtersSubject = new BehaviorSubject<any>({});
  currentFilters = this.filtersSubject.asObservable();

  private resetSubject = new Subject<void>();
  resetTriggered = this.resetSubject.asObservable();

  private _exitACyberResiliencePageSubject = new Subject<void>();
  exitACyberResiliencePageSubject =
    this._exitACyberResiliencePageSubject.asObservable();

  updateShipFunctionsList(newShipFunctionsList: any) {
    this._shipFunctionsSubject.next(newShipFunctionsList);
  }

  updateAppliedFiltersCount(currentActiveFiltersCount: number) {
    this._appliedFiltersAmountSubject.next(currentActiveFiltersCount);
  }

  // updateCurrentNavigationTarget(newTargetPage: any) {
  //   this._currentNavigationTarget.next(newTargetPage);
  // }

  resetFiltersCount(): void {
    this._appliedFiltersAmountSubject.next(0);
  }

  updateFilters(newFilters: any) {
    this.filtersSubject.next(newFilters);
  }

  triggerReset() {
    this.resetSubject.next();
    this.resetFiltersCount();
  }

  leavingAnIncidentPage() {
    this._exitACyberResiliencePageSubject.next();
  }
}
