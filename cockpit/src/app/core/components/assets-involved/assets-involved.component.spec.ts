import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AssetsInvolvedComponent } from "./assets-involved.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";

describe("AssetsInvolvedComponent", () => {
  let component: AssetsInvolvedComponent;
  let fixture: ComponentFixture<AssetsInvolvedComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsInvolvedComponent, getTranslocoModule()],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AssetsInvolvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
