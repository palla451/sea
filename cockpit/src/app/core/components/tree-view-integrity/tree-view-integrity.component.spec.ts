import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TreeViewIntegrityComponent } from "./tree-view-integrity.component";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { of } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";
import { CyberResilienceParametersComponent } from "../cyber-resilience-parameters/cyber-resilience-parameters.component";
import { provideMockStore } from "@ngrx/store/testing";
import { Store } from "@ngrx/store";
import { FunctionNode } from "../../../features/dashboard/models/dashboard.models";
import { fromCyberResilience } from "../../../features/dashboard/state";

describe("TreeViewIntegrityComponent", () => {
  let component: TreeViewIntegrityComponent;
  let fixture: ComponentFixture<TreeViewIntegrityComponent>;

  const mockedShipFunctions: FunctionNode[] = [
    {
      id: 1,
      name: "Navigation",
      description: "Navigation",
      assets: [],
      children: [
        {
          id: 3,
          name: "GPS",
          description: "GPS System",
          assets: [],
        },
      ],
    },
    {
      id: 2,
      name: "Propulsion",
      description: "Propulsion System",
      assets: [],
      children: [
        {
          id: 4,
          name: "Engine",
          description: "Main Engine",
          assets: [],
        },
      ],
    },
  ];

  const mockService = {
    selectedCyberResiliencePerformance$: of(null),
    countCompromisedAssets$: jasmine.createSpy().and.returnValue(of(2)),
    countOperationalAssets$: jasmine.createSpy().and.returnValue(of(5)),
  };

  const mockStore = {
    select: jasmine.createSpy().and.returnValue(of(mockedShipFunctions)),
    dispatch: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        TreeViewNodeComponent,
        CyberResilienceParametersComponent,
      ],
      providers: [
        { provide: CyberResilienceOVManagerService, useValue: mockService },
        provideMockStore({
          selectors: [
            {
              selector: fromCyberResilience.selectShipFunctions,
              value: mockedShipFunctions,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeViewIntegrityComponent);
    component = fixture.componentInstance;

    // component.shipFunctions = of(mockedShipFunctions);
    fixture.detectChanges(); // Assicura che il componente aggiorni i dati
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should compute accordion data correctly", () => {
    fixture.detectChanges();
    expect(component.accordionData()).toBeDefined();
  });

  // it("should filter nodes correctly", () => {
  //   component.searchTerm = "Navigation";
  //   component.filterNodes();
  //   expect(component.filteredData).toBeDefined();
  //   expect(component.filteredData?.title).toContain("Navigation");
  // });

  it("should hide integrity hint when searching", () => {
    component.searchTerm = "Navigation";
    component.filterNodes();
    expect(component.isIntegrityHintHidden()).toBeTrue();
  });

  it("should clear the search correctly", () => {
    component.searchTerm = "Test";
    component.filterNodes();
    component.clearSearch();
    expect(component.searchTerm).toBe("");
    expect(component.filteredData).toBeNull();
  });
});
