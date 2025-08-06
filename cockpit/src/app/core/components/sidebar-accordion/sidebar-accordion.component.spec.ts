import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SidebarAccordionComponent } from "./sidebar-accordion.component";

describe("SidebarAccordionComponent", () => {
  let component: SidebarAccordionComponent;
  let fixture: ComponentFixture<SidebarAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
