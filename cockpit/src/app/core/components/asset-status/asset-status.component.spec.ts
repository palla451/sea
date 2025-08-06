import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetStatusComponent } from "./asset-status.component";

describe("AssetStatusComponent", () => {
  let component: AssetStatusComponent;
  let fixture: ComponentFixture<AssetStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit correct status when updateFilters is called", () => {
    component.selectedLevels = {
      operational: true,
      turnedOff: false,
      maintenance: true,
      compromised: false,
    };

    const spy = spyOn(component.assetsStatusSet, "emit");

    component.updateFilters();

    expect(spy).toHaveBeenCalledWith(["OPERATIONAL", "MAINTENANCE"]);
  });

  it("should emit empty array when no filter is selected", () => {
    component.selectedLevels = {
      operational: false,
      turnedOff: false,
      maintenance: false,
      compromised: false,
    };

    const spy = spyOn(component.assetsStatusSet, "emit");
    component.updateFilters();

    expect(spy).toHaveBeenCalledWith([]);
  });
});
