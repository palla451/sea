import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CyberResilienceOverviewComponent } from "./cyber-resilience-overview.component";
import { CommonModule } from "@angular/common";
import { TreeViewIntegrityComponent } from "../tree-view-integrity/tree-view-integrity.component";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { NavigationService } from "../../services/navigation.service";
import { ToastModule } from "primeng/toast";
import { of } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("CyberResilienceOverviewComponent", () => {
  let component: CyberResilienceOverviewComponent;
  let fixture: ComponentFixture<CyberResilienceOverviewComponent>;
  let crOverviewManager: jasmine.SpyObj<CyberResilienceOVManagerService>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let store: MockStore;
  beforeEach(() => {
    crOverviewManager = jasmine.createSpyObj(
      "CyberResilienceOVManagerService",
      [
        "updateSelectedCRPerformance",
        "countCompromisedAssets$",
        "countOperationalAssets$",
      ],
      {
        cyberPerformancesList$: of([]),
        selectedCyberResiliencePerformance$: of(null),
      }
    );
    crOverviewManager.countCompromisedAssets$.and.returnValue(of(2));
    crOverviewManager.countOperationalAssets$.and.returnValue(of(3));

    navigationService = jasmine.createSpyObj("NavigationService", [
      "closeCyberResilienceOVPage",
    ]);

    TestBed.configureTestingModule({
      imports: [CommonModule, TreeViewIntegrityComponent, ToastModule],
      providers: [
        {
          provide: CyberResilienceOVManagerService,
          useValue: crOverviewManager,
        },
        { provide: NavigationService, useValue: navigationService },
        provideMockStore({ initialState: {} }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CyberResilienceOverviewComponent);
    component = fixture.componentInstance;
  });

  it("should call closeCyberResilienceOVPage when navigateToDashboard is called", () => {
    component.navigateToDashboard();

    expect(navigationService.closeCyberResilienceOVPage).toHaveBeenCalled();
  });
});
