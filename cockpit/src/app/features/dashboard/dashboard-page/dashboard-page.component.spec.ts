import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardPageComponent } from "./dashboard-page.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  fromDashboardCore,
  selectCompromisedAssetsCount,
  selectMaintenanceAssetsCount,
  selectOperationalAssetsCount,
  selectTurnedOffAssetsCount,
} from "../../../core/state";

describe("DashboardPageComponent", () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let store: MockStore;

  const mockedIncidents = [
    {
      id: 123456789,
      title: "New device detected",
      description: "New device detected",
      severity: "High",
      critically: "5",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-01T09:15:00Z",
      creationDate: "2025-07-01T09:15:00Z",
      updateDate: "2025-07-01T09:15:00Z",
      assets: [
        { deck: "4", frame: "80", mvz: "2" },
        { deck: "5", frame: "142", mvz: "3" },
        { deck: "7", frame: "226", mvz: "4" },
      ],
    },
    {
      id: 987654321,
      title: "Anomalous data flow",
      description: "Anomalous data flow",
      severity: "Critical",
      critically: "3",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-11T14:30:00Z",
      creationDate: "2025-07-11T14:30:00Z",
      updateDate: "2025-07-11T14:30:00Z",
      assets: [
        { deck: "5", frame: "89", mvz: "2" },
        { deck: "9", frame: "147", mvz: "3" },
      ],
    },
    {
      id: 232425267,
      title: "Malaware detected on MF03",
      description: "Malaware detected on MF03",
      severity: "Medium",
      critically: "2",
      summary: "",
      tags: "",
      status: "New",
      createdAt: "2025-07-21T08:45:00Z",
      creationDate: "2025-07-21T08:45:00Z",
      updateDate: "2025-07-21T08:45:00Z",
      assets: [{ deck: "2", frame: "97", mvz: "2" }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromDashboardCore.selectAllIncidentsList,
              value: mockedIncidents,
            },
            {
              selector: selectOperationalAssetsCount,
              value: 0,
            },
            {
              selector: selectTurnedOffAssetsCount,
              value: 0,
            },
            {
              selector: selectMaintenanceAssetsCount,
              value: 0,
            },
            {
              selector: selectCompromisedAssetsCount,
              value: 0,
            },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
