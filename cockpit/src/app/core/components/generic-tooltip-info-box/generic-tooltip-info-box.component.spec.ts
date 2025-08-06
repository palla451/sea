import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTooltipInfoBoxComponent } from './generic-tooltip-info-box.component';

describe('GenericTooltipInfoBoxComponent', () => {
  let component: GenericTooltipInfoBoxComponent;
  let fixture: ComponentFixture<GenericTooltipInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTooltipInfoBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTooltipInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
