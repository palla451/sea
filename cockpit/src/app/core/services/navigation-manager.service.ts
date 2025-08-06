import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavigationManagerService {
  private _hostingPage = new BehaviorSubject<string>("");
  hostingPage = this._hostingPage.asObservable();

  updateCurrentHostingPage(newHostingPage: any) {
    this._hostingPage.next(newHostingPage);
  }
}
