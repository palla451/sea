import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OpenIncidentsPageComponent } from "./open-incidents-page.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("OpenIncidentsPageComponent", () => {
  let component: OpenIncidentsPageComponent;
  let fixture: ComponentFixture<OpenIncidentsPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenIncidentsPageComponent],
      providers: [
        provideMockStore({
          initialState: {},
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(OpenIncidentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
