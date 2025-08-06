import { TestBed } from "@angular/core/testing";
import {
  HistorySidebarService,
  HistoryTableColumns,
} from "./history-sidebar.service";
import { take } from "rxjs/operators";

describe("HistorySidebarService", () => {
  let service: HistorySidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorySidebarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return initial columns config", () => {
    const initial = service.getInitialColumnsConfig();
    expect(initial.length).toBeGreaterThan(0);
    expect(initial.find((col) => col.field === "id")).toBeDefined();
  });

  it("should update visible columns correctly", (done) => {
    const selected: HistoryTableColumns[] = [
      { field: "id", header: "ID", visible: false, sortable: false },
      {
        field: "description",
        header: "DESCRIPTION",
        visible: false,
        sortable: true,
      },
    ];
    service.updateVisibleColumns(selected);
    service.visibleColumns$.pipe(take(1)).subscribe((cols) => {
      const idCol = cols.find((c) => c.field === "id");
      const descriptionCol = cols.find((c) => c.field === "description");
      const deckCol = cols.find((c) => c.field === "deck");
      expect(idCol?.visible).toBeTrue();
      expect(descriptionCol?.visible).toBeTrue();
      expect(deckCol?.visible).toBeFalse();
      done();
    });
  });

  it("should reset visible columns to initial config", (done) => {
    service.updateVisibleColumns([]);
    service.resetVisibleColumnsInitialConfig();
    service.visibleColumns$.pipe(take(1)).subscribe((cols) => {
      expect(cols).toEqual(service.getInitialColumnsConfig());
      done();
    });
  });

  it("should update incident list", (done) => {
    const incidents = [{ id: 1, description: "desc", severity: "high" }];
    service.updateIncidentList(incidents as any);
    service.closedIncidentsListSubject.pipe(take(1)).subscribe((list) => {
      expect(list.length).toBe(1);
      expect(list[0].description).toBe("desc");
      done();
    });
  });

  it("should update and reset applied filters count", (done) => {
    service.updateAppliedFiltersCount(5);
    service.appliedFiltersAmountSubject.pipe(take(1)).subscribe((count) => {
      expect(count).toBe(5);
      service.resetFiltersCount();
      service.appliedFiltersAmountSubject
        .pipe(take(1))
        .subscribe((resetCount) => {
          expect(resetCount).toBe(0);
          done();
        });
    });
  });

  it("should update filters", (done) => {
    const filters = { status: "open" };
    service.updateFilters(filters);
    service.currentFilters.pipe(take(1)).subscribe((f) => {
      expect(f.status).toBe("open");
      done();
    });
  });

  it("should trigger reset", (done) => {
    service.triggerReset();
    service.resetTriggered.pipe(take(1)).subscribe((val) => {
      expect(val).toBeTrue();
      done();
    });
  });

  describe("Observable transformation methods", () => {
    beforeEach(() => {
      const incidents = [
        {
          description: "desc1",
          severity: "high",
          decks: ["1", "3"],
          frames: ["2"],
          mvz: ["mvz1", "mvz2"],
        },
        {
          description: "desc2",
          severity: "low",
          decks: ["2"],
          frames: ["1", "2"],
          mvz: ["mvz2"],
        },
        {
          description: null,
          severity: "medium",
          decks: [],
          frames: [],
          mvz: [],
        },
      ];
      service.updateIncidentList(incidents as any);
    });

    it("should get unique descriptions", (done) => {
      service
        .getIncidentsDescriptionOptions()
        .pipe(take(1))
        .subscribe((descs) => {
          expect(descs).toContain("desc1");
          expect(descs).toContain("desc2");
          expect(descs.length).toBe(2);
          done();
        });
    });

    it("should get severity options", (done) => {
      service
        .getIncidentsAlertsLevelOptions()
        .pipe(take(1))
        .subscribe((severities) => {
          expect(severities).toEqual(["high", "low", "medium"]);
          done();
        });
    });

    it("should get decks sorted as strings", (done) => {
      service
        .getIncidentsDeckOptions()
        .pipe(take(1))
        .subscribe((decks) => {
          expect(decks).toEqual(["1", "2", "3"]);
          done();
        });
    });

    it("should get frames sorted as strings", (done) => {
      service
        .getIncidentsFrameOptions()
        .pipe(take(1))
        .subscribe((frames) => {
          expect(frames).toEqual(["1", "2"]);
          done();
        });
    });

    it("should get mvz sorted and unique", (done) => {
      service
        .getIncidentsMVZOptions()
        .pipe(take(1))
        .subscribe((mvz) => {
          expect(mvz).toEqual(["mvz1", "mvz2"]);
          done();
        });
    });
  });
});
