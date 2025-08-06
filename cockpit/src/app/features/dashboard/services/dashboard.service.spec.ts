import { TestBed } from "@angular/core/testing";
import {
  SidebarService,
  IncidentOVTableColumns,
} from "./dashboard-sidebar.service";
import { Incident } from "../models/dashboard.models";

describe("SidebarService", () => {
  let service: SidebarService;

  const mockedIncident: Incident[] = [
    {
      id: 123456789,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: new Date("2025-07-01T09:15:00Z"),
      creationDate: new Date("2025-07-01T09:15:00Z"),
      updateDate: new Date("2025-07-01T09:15:00Z"),
      assets: [
        { deck: "4", frame: "80", mvz: "2" },
        { deck: "5", frame: "142", mvz: "3" },
        { deck: "7", frame: "226", mvz: "4" },
      ],
      decks: [4, 5, 7, 8],
      frames: [80, 142, 226, 300],
      mvz: [2, 3, 4, 5],
      assetsInvolved: 3,
    },
    {
      id: 987654321,
      title: "System Alert",
      description: "Potential issue detected",
      severity: "Medium",
      critically: "3",
      summary: "",
      tags: "",
      status: "In Progress",
      createdAt: new Date("2025-07-02T11:30:00Z"),
      creationDate: new Date("2025-07-02T11:30:00Z"),
      updateDate: new Date("2025-07-02T11:30:00Z"),
      assets: [
        { deck: "5", frame: "142", mvz: "3" },
        { deck: "7", frame: "226", mvz: "4" },
        { deck: "8", frame: "300", mvz: "5" },
      ],
      decks: [4, 5, 7, 8],
      frames: [80, 142, 226, 300],
      mvz: [2, 3, 4, 5],
      assetsInvolved: 3,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarService],
    });
    service = TestBed.inject(SidebarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should update visible columns correctly", (done) => {
    const selectedColumns: IncidentOVTableColumns[] = [
      { field: "id", header: "ID", visible: true, sortable: false },
      {
        field: "description",
        header: "Description",
        visible: true,
        sortable: true,
      },
      { field: "mvz", header: "MVZ", visible: true, sortable: true },
    ];

    service.updateVisibleColumns(selectedColumns);

    service.visibleColumns$.subscribe((columns) => {
      selectedColumns?.forEach((selected) => {
        const updated = columns.find((c) => c.field === selected.field);
        expect(updated?.visible).toBeTrue();
      });

      const notSelected = columns.filter(
        (col) => !selectedColumns.some((sel) => sel.field === col.field)
      );
      notSelected?.forEach((col) => {
        expect(col.visible).toBeFalse();
      });

      done();
    });
  });

  it("should update applied filters count", (done) => {
    service.updateAppliedFiltersCount(3);

    service.appliedFiltersAmountSubject.subscribe((count) => {
      expect(count).toBe(3);
      done();
    });
  });

  it("should reset applied filters count", (done) => {
    service.updateAppliedFiltersCount(5);
    service.resetFiltersCount();

    service.appliedFiltersAmountSubject.subscribe((count) => {
      expect(count).toBe(0);
      done();
    });
  });

  it("should reset visible columns to initial config", (done) => {
    const initialConfig = service.getInitialColumnsConfig();
    service.resetVisibleColumnsInitialConfig();

    service.visibleColumns$.subscribe((columns) => {
      expect(columns).toEqual(initialConfig);
      done();
    });
  });

  it("should update incident list", (done) => {
    service.updateIncidentList(mockedIncident);

    service.incidentListSubject.subscribe((incidents) => {
      expect(incidents).toEqual(mockedIncident);
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

  it("should extract unique deck values from incidents", (done) => {
    service.updateIncidentList(mockedIncident);

    service.getIncidentsDeckOptions().subscribe((decks) => {
      expect(decks).toEqual(["4", "5", "7", "8"]);
      done();
    });
  });

  it("should extract unique frame values from incidents", (done) => {
    service.updateIncidentList(mockedIncident);

    service.getIncidentsFrameOptions().subscribe((frames) => {
      expect(frames).toEqual(["80", "142", "226", "300"]);
      done();
    });
  });

  it("should extract unique MVZ values from incidents", (done) => {
    service.updateIncidentList(mockedIncident);

    service.getIncidentsMVZOptions().subscribe((mvz) => {
      expect(mvz).toEqual(["2", "3", "4", "5"]);
      done();
    });
  });
});
