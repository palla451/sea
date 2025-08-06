import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncidentTimelineModalComponent } from "./incident-timeline-modal.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("IncidentTimelineModalComponent", () => {
  let component: IncidentTimelineModalComponent;
  let fixture: ComponentFixture<IncidentTimelineModalComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTimelineModalComponent, HttpClientTestingModule],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(IncidentTimelineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
