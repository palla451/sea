import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarsAccordionComponent } from './sidebars-accordion.component';

describe('SidebarsAccordionComponent', () => {
  let component: SidebarsAccordionComponent;
  let fixture: ComponentFixture<SidebarsAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarsAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
