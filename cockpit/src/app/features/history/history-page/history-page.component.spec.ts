import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HistoryPageComponent } from "./history-page.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("HistoryPageComponent", () => {
  let component: HistoryPageComponent;
  let fixture: ComponentFixture<HistoryPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPageComponent],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
