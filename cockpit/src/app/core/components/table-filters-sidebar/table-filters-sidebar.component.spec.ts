import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TableFiltersSidebarComponent } from "./table-filters-sidebar.component";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { NavigationManagerService } from "../../services/navigation-manager.service";
import { ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { of, Subject } from "rxjs";

describe("TableFiltersSidebarComponent", () => {
  let component: TableFiltersSidebarComponent;
  let fixture: ComponentFixture<TableFiltersSidebarComponent>;
  let sidebarServiceSpy: jasmine.SpyObj<SidebarService>;
  let navigationManagerServiceSpy: jasmine.SpyObj<NavigationManagerService>;

  beforeEach(async () => {
    sidebarServiceSpy = jasmine.createSpyObj("SidebarService", [
      "updateAppliedFiltersCount",
      "updateFilters",
      "triggerReset",
      "getIncidentsDescriptionOptions",
      "appliedFiltersAmountSubject",
    ]);
    navigationManagerServiceSpy = jasmine.createSpyObj(
      "NavigationManagerService",
      ["hostingPage"],
      {
        hostingPage: of("mock-page"),
      }
    );

    sidebarServiceSpy.getIncidentsDescriptionOptions.and.returnValue(
      of(["desc1", "desc2"])
    );
    sidebarServiceSpy.appliedFiltersAmountSubject = new Subject<number>();

    await TestBed.configureTestingModule({
      imports: [TableFiltersSidebarComponent],
      providers: [
        { provide: SidebarService, useValue: sidebarServiceSpy },
        {
          provide: NavigationManagerService,
          useValue: navigationManagerServiceSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should emit onSidebarClosing when close() is called", () => {
    spyOn(component.onSidebarClosing, "emit");
    component.close();
    expect(component.isOpen).toBeFalse();
    expect(component.onSidebarClosing.emit).toHaveBeenCalled();
  });

  it("should update selectedAlertsLevels and call updateAppliedFiltersCount in getAlertsSet", () => {
    const testLevels = ["HIGH", "LOW"];
    component.getAlertsSet(testLevels);
    expect(component.selectedAlertsLevels).toEqual(testLevels);
    expect(sidebarServiceSpy.updateAppliedFiltersCount).toHaveBeenCalled();
  });

  xit("should update selectedAlertStatus and call updateAppliedFiltersCount in getAssetsStatusSet", () => {
    const testStatus = ["OPERATIONAL", "MAINTENANCE"];
    component.getAssetsStatusSet(testStatus);
    expect(component.selectedAlertStatus).toEqual(testStatus);
    expect(sidebarServiceSpy.updateAppliedFiltersCount).toHaveBeenCalled();
  });

  xit("should count applied filters correctly and enable button if filters exist", () => {
    const buttonMock = document.createElement("button");
    component.buttonSaveFiltersRef = {
      nativeElement: buttonMock,
    } as ElementRef<HTMLButtonElement>;

    component.activeFilters = {
      levels: ["HIGH"],
      dates: { start: null, end: null },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      assetsStatus: [],
    };

    const count = component["countAppliedFilters"](component.activeFilters);
    expect(count).toBe(1);
    component.ngAfterViewInit();
    expect(buttonMock.disabled).toBeFalse();
  });

  it("should disable save button if no filters applied", () => {
    const buttonMock = document.createElement("button");
    component.buttonSaveFiltersRef = {
      nativeElement: buttonMock,
    } as ElementRef<HTMLButtonElement>;

    component.activeFilters = {
      levels: [],
      dates: { start: null, end: null },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      assetsStatus: [],
    };

    const count = component["countAppliedFilters"](component.activeFilters);
    expect(count).toBe(0);
    component.ngAfterViewInit();
    expect(buttonMock.disabled).toBeTrue();
  });

  it("should call updateFilters and updateAppliedFiltersCount on save()", () => {
    spyOn(component, "close");
    component.activeFilters = {
      levels: ["HIGH"],
      dates: { start: null, end: null },
      descriptionsSelections: [],
      decksSelections: [],
      framesSelections: [],
      mvzSelections: [],
      assetsStatus: [],
    };

    component.saveDashboardFilters();
    expect(sidebarServiceSpy.updateFilters).toHaveBeenCalledWith(
      component.activeFilters
    );
    expect(sidebarServiceSpy.updateAppliedFiltersCount).toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();
  });

  describe("reset()", () => {
    it("should reset all selected filter values", () => {
      component.selectedAlertsLevels = ["HIGH"];
      component.selectedStartDate = new Date();
      component.selectedEndDate = new Date();
      component.descriptionSelectedValues = ["desc1"];
      component.decksSelectedValues = ["deck1"];
      component.framesSelectedValues = ["frame1"];
      component.mvzSelectedValues = ["mvz1"];
      component.selectedAlertStatus = ["OPERATIONAL"];

      component.resetHistoryIncidentsFilters();
      component.resetAssetMngmtFilters();

      expect(component.selectedAlertsLevels).toEqual([]);
      expect(component.selectedStartDate).toBeNull();
      expect(component.selectedEndDate).toBeNull();
      expect(component.descriptionSelectedValues).toEqual([]);
      expect(component.decksSelectedValues).toEqual([]);
      expect(component.framesSelectedValues).toEqual([]);
      expect(component.mvzSelectedValues).toEqual([]);
      expect(component.selectedAlertStatus).toEqual([]);
    });

    it("should call sidebarService.triggerReset() and component.close()", () => {
      spyOn(component, "close");

      component.resetDashboardFilters();

      expect(sidebarServiceSpy.triggerReset).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
