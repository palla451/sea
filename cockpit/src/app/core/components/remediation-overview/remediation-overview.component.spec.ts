import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RemediationOverviewComponent } from "./remediation-overview.component";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("RemediationOverviewComponent", () => {
  let component: RemediationOverviewComponent;
  let fixture: ComponentFixture<RemediationOverviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationOverviewComponent, getTranslocoModule()],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RemediationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
