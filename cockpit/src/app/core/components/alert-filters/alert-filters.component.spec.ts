import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AlertFiltersComponent } from "./alert-filters.component";

describe("AlertFiltersComponent", () => {
  let component: AlertFiltersComponent;
  let fixture: ComponentFixture<AlertFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should emit correct alert levels when updateFilters is called", () => {
    component.selectedLevels = {
      critical: true,
      high: false,
      medium: true,
      low: false,
    };

    const spy = spyOn(component.alertsSet, "emit");

    component.updateFilters();

    expect(spy).toHaveBeenCalledWith(["CRITICAL", "MEDIUM"]);
  });

  it("should emit empty array when no alert level is selected", () => {
    component.selectedLevels = {
      critical: false,
      high: false,
      medium: false,
      low: false,
    };

    const spy = spyOn(component.alertsSet, "emit");

    component.updateFilters();

    expect(spy).toHaveBeenCalledWith([]);
  });
});
