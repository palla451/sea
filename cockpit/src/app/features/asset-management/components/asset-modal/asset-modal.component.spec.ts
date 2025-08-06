import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetModalComponent } from "./asset-modal.component";
import { getTranslocoModule } from "../../../../shared/transloco-testing.module";
import { TableModalService } from "../../services/table-modal.service";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";

describe("AssetModalComponent", () => {
  let component: AssetModalComponent;
  let fixture: ComponentFixture<AssetModalComponent>;
  let tableModalServiceMock: any;
  let store: Store;
  const mockAsset = {
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
  };

  beforeEach(async () => {
    tableModalServiceMock = {
      openModal$: new Subject<any>(),
      updateAsset: jasmine.createSpy("updateAsset"),
    };
    await TestBed.configureTestingModule({
      imports: [AssetModalComponent, getTranslocoModule()],
      providers: [
        { provide: TableModalService, useValue: tableModalServiceMock },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should subscribe to openModal$ and set asset data on ngOnInit", () => {
    tableModalServiceMock.openModal$.next(mockAsset);
    expect(component.asset).toEqual(mockAsset);
    expect(component.initialState).toBe("Turned Off");
    expect(component.selectedState).toBe("Turned Off");
    expect(component.isSaveEnabled).toBeFalse();
    expect(component.showAssetModal).toBeTrue();
  });

  it("should open and close the modal", () => {
    component.openAssetModal();
    expect(component.showAssetModal).toBeTrue();

    component.closeAssetModal();
    expect(component.showAssetModal).toBeFalse();
  });

  it("should enable save button when state changes", () => {
    component.initialState = "Operational";
    component.selectedState = "Compromised";
    component.onStateChange();
    expect(component.isSaveEnabled).toBeTrue();

    component.selectedState = "Operational";
    component.onStateChange();
    expect(component.isSaveEnabled).toBeFalse();
  });

  it("should close modal on save", () => {
    spyOn(component, "closeAssetModal");
    component.onSave();
    expect(component.closeAssetModal).toHaveBeenCalled();
  });

  it("should enable save when state changes", () => {
    component.initialState = "Turned Off";
    component.selectedState = "Maintenance";
    component.onStateChange();
    expect(component.isSaveEnabled).toBeTrue();

    component.selectedState = "Turned Off";
    component.onStateChange();
    expect(component.isSaveEnabled).toBeFalse();
  });
});
