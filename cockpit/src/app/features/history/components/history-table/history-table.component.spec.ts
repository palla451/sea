import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HistoryTableComponent } from "./history-table.component";
import { Store } from "@ngrx/store";
import { HistorySidebarService } from "../../services/history-sidebar.service";
import { Incident } from "../../../dashboard/models/dashboard.models";
import { of, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

describe("HistoryTableComponent", () => {
  let component: HistoryTableComponent;
  let fixture: ComponentFixture<HistoryTableComponent>;
  let historySidebarService: HistorySidebarService;
  let store: Store;
  let router: Router;

  let mockFiltersSubject: BehaviorSubject<any>;
  let mockResetSubject: BehaviorSubject<any>;

  const mockIncidents: Incident[] = [
    {
      id: 1,
      title: "Power Failure in Engine Room",
      description: "Unexpected power failure caused by electrical overload.",
      severity: "high",
      critically: "critical",
      decks: [1, 2],
      frames: [12, 13],
      mvz: [3],
      assets: [
        { deck: "1", frame: "12", mvz: "3" },
        { deck: "1", frame: "11", mvz: "4" },
      ],
      summary: "Multiple systems affected by power failure.",
      tags: "power,engine,urgent",
      status: "compromised",
      assetsInvolved: 2,
      createdAt: new Date("2025-05-30T10:00:00Z"),
      creationDate: new Date("2025-05-30T10:00:00Z"),
      updateDate: new Date("2025-06-01T09:30:00Z"),
    },
    {
      id: 2,
      title: "Water Leak Detected",
      description: "Leak in the freshwater tank pipeline.",
      severity: "medium",
      critically: "moderate",
      decks: [3],
      frames: [20],
      mvz: [5],
      assets: [{ deck: "5", frame: "17", mvz: "4" }],
      summary: "Leak contained, minor damage reported.",
      tags: "water,plumbing",
      status: "maintenance",
      assetsInvolved: 1,
      createdAt: new Date("2025-05-25T08:00:00Z"),
      creationDate: new Date("2025-05-25T08:00:00Z"),
      updateDate: new Date("2025-05-26T12:15:00Z"),
    },
  ];

  beforeEach(async () => {
    mockFiltersSubject = new BehaviorSubject({});
    mockResetSubject = new BehaviorSubject(null);

    const mockHistorySidebarService = {
      currentFilters: mockFiltersSubject.asObservable(),
      resetTriggered: mockResetSubject.asObservable(),
      appliedFiltersAmountSubject: of(0),
      visibleColumns$: of([]),
      getInitialColumnsConfig: () => [],
    };

    await TestBed.configureTestingModule({
      imports: [HistoryTableComponent],
      providers: [
        { provide: HistorySidebarService, useValue: mockHistorySidebarService },
        {
          provide: Store,
          useValue: { dispatch: jasmine.createSpy("dispatch") },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy("navigate") },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryTableComponent);
    component = fixture.componentInstance;
    historySidebarService = TestBed.inject(HistorySidebarService);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    mockFiltersSubject.complete();
    mockResetSubject.complete();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });

  // describe("Filters", () => {
  //   it("should apply filters correctly", () => {
  //     mockFiltersSubject.next({ levels: ["High"] });
  //     fixture.detectChanges();

  //     expect(component.incidentsSignal()).toEqual([
  //       {
  //         id: 2,
  //         title: "Water Leak Detected",
  //         description: "Leak in the freshwater tank pipeline.",
  //         severity: "medium",
  //         critically: "moderate",
  //         decks: [3],
  //         frames: [20],
  //         mvz: [5],
  //         assets: [{ deck: "5", frame: "17", mvz: "4" }],
  //         summary: "Leak contained, minor damage reported.",
  //         tags: "water,plumbing",
  //         status: "maintenance",
  //         assetsInvolved: 1,
  //         createdAt: new Date("2025-05-25T08:00:00Z"),
  //         creationDate: new Date("2025-05-25T08:00:00Z"),
  //         updateDate: new Date("2025-05-26T12:15:00Z"),
  //       },
  //     ]);
  //   });

  //   it("should reset filters correctly", () => {
  //     mockResetSubject.next(null);
  //     fixture.detectChanges();

  //     expect(component.incidentsSignal()).toEqual(mockIncidents);
  //   });
  // });

  // describe("Pagination", () => {
  //   it("should update pagination state correctly", () => {
  //     component.rows.set(1);
  //     component.onPageChange({ first: 1, rows: 1 });

  //     expect(component.first()).toBe(1);
  //     expect(component.rows()).toBe(1);
  //   });

  //   it("should paginate incidents correctly", () => {
  //     component.incidents = mockIncidents;
  //     component.rows.set(1);
  //     component.first.set(1);

  //     fixture.detectChanges();
  //     expect(component.paginatedIncidents()).toEqual([mockIncidents[1]]);
  //   });
  // });

  // describe("Incident Interaction", () => {
  //   it("should navigate to incident detail on click", () => {
  //     component.onIncidentClick("1");
  //     expect(store.dispatch).toHaveBeenCalled();
  //     expect(router.navigate).toHaveBeenCalledWith(["/incident-detail", "1"]);
  //   });
  // });

  // describe("Styling", () => {
  //   it("should return correct severity color", () => {
  //     expect(component.getAlertSeverityColor("High")).toBe("#F64D4D");
  //     expect(component.getAlertSeverityColor("Medium")).toBe("#FF8826");
  //     expect(component.getAlertSeverityColor("Low")).toBe("#FFCF26");
  //   });

  //   it("should return correct severity shadow", () => {
  //     expect(component.getAlertSeverityShadow("Critical")).toBe(
  //       "0 0 0 2px rgba(246, 77, 77, 0.2)"
  //     );
  //     expect(component.getAlertSeverityShadow("Medium")).toBe(
  //       "0 0 0 2px rgba(255, 136, 38, 0.2)"
  //     );
  //   });
  // });

  // describe("Utility Methods", () => {
  //   it("should return formatted list string", () => {
  //     expect(component.getFormattedList([10, 20, 30])).toBe("10 · 20 · 30");
  //   });

  //   it("should correctly map closed status label", () => {
  //     expect(component.mapClosedStatusLabel("Closed")).toBe("Solved");
  //     expect(component.mapClosedStatusLabel("Active")).toBe("Active");
  //   });
  // });
});
