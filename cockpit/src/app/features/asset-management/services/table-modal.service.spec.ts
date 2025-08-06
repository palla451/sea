import { TestBed } from "@angular/core/testing";
import { TableModalService } from "./table-modal.service";
import { take } from "rxjs";
import { Asset } from "../../../core/models/asset.model";

describe("TableModalService", () => {
  let service: TableModalService;
  const mockAsset: Asset = {
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
  } as Asset;
  const LOCAL_STORAGE_KEY = "ASSETS_STORAGE";

  beforeEach(() => {
    localStorage.clear();
    spyOn(localStorage, "setItem").and.callThrough();
    spyOn(localStorage, "getItem").and.returnValue(null);
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableModalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should emit asset on openModal", (done) => {
    service.openModal$.pipe(take(1)).subscribe((emitted) => {
      expect(emitted).toEqual(mockAsset);
      done();
    });

    service.openModal(mockAsset);
  });
  it("should emit null on closeModal", (done) => {
    service.openModal$.pipe(take(1)).subscribe((emitted) => {
      expect(emitted).toBeNull();
      done();
    });

    service.closeModal();
  });

  it("should set and get currentAsset correctly", () => {
    service.openModal(mockAsset);
    expect(service.getCurrentAsset()).toEqual(mockAsset);
  });
});
