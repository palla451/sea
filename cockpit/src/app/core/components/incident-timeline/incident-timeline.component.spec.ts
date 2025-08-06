import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncidentTimelineComponent } from "./incident-timeline.component";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("IncidentTimelineComponent", () => {
  let component: IncidentTimelineComponent;
  let fixture: ComponentFixture<IncidentTimelineComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IncidentTimelineComponent,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(IncidentTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
