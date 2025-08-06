import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Asset } from "../../../core/models/asset.model";

const LOCAL_STORAGE_KEY = "assets";
@Injectable({
  providedIn: "root",
})
export class TableModalService {
  private openModalSubject = new Subject<Asset>();
  openModal$ = this.openModalSubject.asObservable();

  // private assetsSubject = new BehaviorSubject<Asset[]>(
  //   this.loadAssetsFromStorage()
  // );
  // assets$ = this.assetsSubject.asObservable();

  private currentAsset: Asset | null = null;

  constructor() {}

  openModal(asset: Asset) {
    this.currentAsset = asset;
    this.openModalSubject.next(asset);
  }

  closeModal() {
    this.openModalSubject.next(null as any);
  }

  getCurrentAsset(): Asset | null {
    return this.currentAsset;
  }
}
