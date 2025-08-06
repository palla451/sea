import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncidentOverviewTableComponent } from "./incident-overview-table.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("IncidentOverviewTableComponent", () => {
  let component: IncidentOverviewTableComponent;
  let fixture: ComponentFixture<IncidentOverviewTableComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentOverviewTableComponent],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(IncidentOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
