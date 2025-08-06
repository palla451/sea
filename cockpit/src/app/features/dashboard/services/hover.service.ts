import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Incident } from "../models/dashboard.models";

@Injectable({ providedIn: "root" })
export class HoverService {
  private hoveredRowSubject = new BehaviorSubject<Incident | null>(null);
  private resetIncident: Incident = {
    id: 0,
    description: "",
    title: "",
    decks: [],
    frames: [],
    assets: [],
    mvz: [],
    assetsInvolved: 0,
    severity: "",
    critically: "",
    createdAt: new Date,
    summary: "",
    tags: "",
    status: "",
    creationDate: new Date,
    updateDate: new Date,
  };
  hoveredRow$ = this.hoveredRowSubject.asObservable();

  setHoveredRow(data: any) {
    this.hoveredRowSubject.next(data);
  }

  clearHoveredRow() {
    this.hoveredRowSubject.next(this.resetIncident);
  }
}
