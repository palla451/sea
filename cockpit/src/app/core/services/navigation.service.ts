import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private _selectedAppMenu$ = new BehaviorSubject<string>("");
  private _cyberResilienceOVSelected$ = new BehaviorSubject<boolean|undefined>(undefined);
  selectedAppMenu$ = this._selectedAppMenu$.asObservable();
  cyberResilienceOVSelected$ = this._cyberResilienceOVSelected$.asObservable();

  updateSelectedAppMenu(newSelectedAppMenu: string) {
    this._selectedAppMenu$.next(newSelectedAppMenu);
  }

  getSelectedAppMenu(): Observable<string> {
    return this._selectedAppMenu$.asObservable();
  }

  openCyberResilienceOVPage() {
    this._cyberResilienceOVSelected$.next(true);
  }

  closeCyberResilienceOVPage() {
    this._cyberResilienceOVSelected$.next(false);
  }
}
