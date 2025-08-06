import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncidentDetailPageComponent } from "./incident-detail-page.component";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("IncidentDetailPageComponent", () => {
  let component: IncidentDetailPageComponent;
  let fixture: ComponentFixture<IncidentDetailPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IncidentDetailPageComponent,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(IncidentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
