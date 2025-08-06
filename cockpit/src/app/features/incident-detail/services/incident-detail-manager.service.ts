import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IncidentDecks } from "../../../core/state";
import { IncidentDetailAsset } from "../models/incident-detail.models";

@Injectable({
  providedIn: "root",
})
export class IncidentDetailManagerService {
  private baseSelectedDeck: IncidentDecks = {
    svg: "",
    number: "0",
  };
  private _selectedIncidentDetailDeck = new BehaviorSubject<IncidentDecks>(
    this.baseSelectedDeck
  );
  selectedIncidentDetailDeck = this._selectedIncidentDetailDeck.asObservable();

  private _assetsByCurrentlySelectedDeck = new BehaviorSubject<IncidentDetailAsset[]>([]);
  assetsByCurrentlySelectedDeck =
    this._assetsByCurrentlySelectedDeck.asObservable();

  private _incidentDetailSelectedSeverity = new BehaviorSubject<string>("");
  incidentDetailSelectedSeverity =
    this._incidentDetailSelectedSeverity.asObservable();

  private _incidentAccordionOpened = new BehaviorSubject<boolean>(false);
  incidentAccordionOpened = this._incidentAccordionOpened.asObservable();

  updateSelectedIncidentDetailDeck(selectedIncidentDetailDeck: IncidentDecks) {
    this._selectedIncidentDetailDeck.next(selectedIncidentDetailDeck);
  }

  resetSelectedIncidentDetailDeck(): void {
    this._selectedIncidentDetailDeck.next(this.baseSelectedDeck);
  }

  updateAssetsByCurrentlySelectedDeck(newAssetsList: IncidentDetailAsset[]) {
    this._assetsByCurrentlySelectedDeck.next(newAssetsList);
  }

  updateIncidentDetailSelectedSeverity(newSelectedIncidentSeverity: string) {
    this._incidentDetailSelectedSeverity.next(newSelectedIncidentSeverity);
  }

  updateIncidentAccordionOpened(isAccordionOpened: boolean) {
    this._incidentAccordionOpened.next(isAccordionOpened);
  }
}
