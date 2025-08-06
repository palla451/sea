import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import {
  SidebarService,
  IncidentOVTableColumns,
} from "./dashboard-sidebar.service";
import { Incident } from "../models/dashboard.models";

describe("SidebarService", () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should update incident list and emit value", (done) => {
    const mockIncidents: Incident[] = [
      {
        id: "1",
        description: "Test 1",
        decks: ["1"],
        frames: [1],
        mvz: 1,
      } as any,
      {
        id: "2",
        description: "Test 2",
        decks: ["2"],
        frames: [2],
        mvz: 2,
      } as any,
    ];
    service.updateIncidentList(mockIncidents);

    service.incidentListSubject.subscribe((value) => {
      expect(value).toEqual(mockIncidents);
      done();
    });
  });

  it("should update applied filters count", (done) => {
    service.updateAppliedFiltersCount(3);
    service.appliedFiltersAmountSubject.subscribe((value) => {
      expect(value).toBe(3);
      done();
    });
  });

  it("should reset filters count to 0", (done) => {
    service.resetFiltersCount();
    service.appliedFiltersAmountSubject.subscribe((value) => {
      expect(value).toBe(0);
      done();
    });
  });

  it("should update filters and emit them", (done) => {
    const filters = { alert: "high" };
    service.updateFilters(filters);

    service.currentFilters.subscribe((value) => {
      expect(value).toEqual(filters);
      done();
    });
  });

  it("should trigger reset", (done) => {
    service.resetTriggered.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    service.triggerReset();
  });

  it("should update current navigation target", (done) => {
    const newTarget = "dashboard";
    service.updateCurrentNavigationTarget(newTarget);

    service.currentNavigationTarget.subscribe((value) => {
      expect(value).toBe(newTarget);
      done();
    });
  });

  it("should get deck options sorted and unique", (done) => {
    const incidents: Incident[] = [
      {
        id: "1",
        description: "",
        decks: ["2", "3"],
        frames: [],
        mvz: 0,
      } as any,
      {
        id: "2",
        description: "",
        decks: ["1", "3"],
        frames: [],
        mvz: 0,
      } as any,
    ];
    service.updateIncidentList(incidents);

    service.getIncidentsDeckOptions().subscribe((result) => {
      expect(result).toEqual(["1", "2", "3"]);
      done();
    });
  });

  it("should get frame options sorted and unique", (done) => {
    const incidents: Incident[] = [
      {
        id: "1",
        description: "",
        decks: [],
        frames: [2, 3],
        mvz: 0,
      } as any,
      {
        id: "2",
        description: "",
        decks: [],
        frames: [1, 3],
        mvz: 0,
      } as any,
    ];
    service.updateIncidentList(incidents);

    service.getIncidentsFrameOptions().subscribe((result) => {
      expect(result).toEqual(["1", "2", "3"]);
      done();
    });
  });

  it("should get incident descriptions", (done) => {
    const incidents: Incident[] = [
      { id: "1", description: "Desc1", decks: [], frames: [], mvz: 0 } as any,
      { id: "2", description: "Desc2", decks: [], frames: [], mvz: 0 } as any,
    ];
    service.updateIncidentList(incidents);

    service.getIncidentsDescriptionOptions().subscribe((result) => {
      expect(result).toEqual(["Desc1", "Desc2"]);
      done();
    });
  });
});
