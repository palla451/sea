import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VesselPerformanceComponent } from "./vessel-performance.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { FunctionNode } from "../../../models/dashboard.models";
import { selectAllVesselMacroFunctions } from "../../../state";

describe("VesselPerformanceComponent", () => {
  let component: VesselPerformanceComponent;
  let fixture: ComponentFixture<VesselPerformanceComponent>;
  let store: MockStore;
  const mockedFunctionTree: FunctionNode[] = [
    {
      id: 1,
      name: "Propulsion",
      description: "Handles ship movement",
      parent: undefined,
      children: [
        {
          id: 2,
          name: "Engine Control",
          description: "Controls engine power",
          parent: {
            id: 1,
            name: "Propulsion",
            description: "Handles ship movement",
            parent: undefined,
          },
          children: [
            {
              id: 4,
              name: "Fuel System",
              description: "Manages fuel supply",
              parent: {
                id: 2,
                name: "Engine Control",
                description: "Controls engine power",
                parent: {
                  id: 1,
                  name: "Propulsion",
                  description: "Handles ship movement",
                  parent: undefined,
                },
              },
              children: [],
            },
          ],
        },
        {
          id: 3,
          name: "Steering",
          description: "Controls direction",
          parent: {
            id: 1,
            name: "Propulsion",
            description: "Handles ship movement",
            parent: undefined,
          },
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: "Navigation",
      description: "Guides the ship",
      parent: undefined,
      children: [
        {
          id: 6,
          name: "Radar",
          description: "Detects objects",
          parent: {
            id: 5,
            name: "Navigation",
            description: "Guides the ship",
            parent: undefined,
          },
          children: [],
        },
      ],
    },
  ];

  const initialState = {
    shipFunctions: {
      shipFunctions: mockedFunctionTree,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselPerformanceComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VesselPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
