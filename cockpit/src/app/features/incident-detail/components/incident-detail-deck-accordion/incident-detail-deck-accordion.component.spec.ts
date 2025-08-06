import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncidentDetailDeckAccordionComponent } from "./incident-detail-deck-accordion.component";
import { getTranslocoModule } from "../../../../shared/transloco-testing.module";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("IncidentDetailDeckAccordionComponent", () => {
  let component: IncidentDetailDeckAccordionComponent;
  let fixture: ComponentFixture<IncidentDetailDeckAccordionComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailDeckAccordionComponent, getTranslocoModule()],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(IncidentDetailDeckAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle accordion state and emit value", () => {
    spyOn(component.toggle, "emit");

    //parte a true
    expect(component.isAccordionOpen).toBeTrue();

    component.toggleAccordion();
    expect(component.isAccordionOpen).toBeFalse();
    expect(component.toggle.emit).toHaveBeenCalledWith(false);

    component.toggleAccordion();
    expect(component.isAccordionOpen).toBeTrue();
    expect(component.toggle.emit).toHaveBeenCalledWith(true);
  });
});
