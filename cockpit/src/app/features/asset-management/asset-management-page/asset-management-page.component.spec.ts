import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AssetManagementPageComponent } from "./asset-management-page.component";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { ReducerObservable, StoreModule, StoreRootModule } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslocoModule } from "@jsverse/transloco";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";
import { selectAllAssets } from "../../../core/state";
import { assetActions } from "../../../core/state/actions";

describe("AssetManagementPageComponent", () => {
  let component: AssetManagementPageComponent;
  let fixture: ComponentFixture<AssetManagementPageComponent>;
  let store: MockStore;

  const mockAssets = [
    {
      id: 15,
      pieceMark: "O567",
      type: "FW",
      systemInfo: "System Pi",
      deck: 4,
      mvz: 4,
      frame: 7,
      position: "CL",
      room: "14",
      cabinet: "28",
      status: "Turned Off",
      name: "Asset15",
      functions: [],
      creationDate: "2025-04-18",
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssetManagementPageComponent,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAllAssets.selectAssets,
              value: mockAssets,
            },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AssetManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch getAllAssetsList on init", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(assetActions.getAllAssetsList());
  });

  it("should expose the assets signal with the mock data", () => {
    expect(component.assets()).toEqual(mockAssets);
  });
});
