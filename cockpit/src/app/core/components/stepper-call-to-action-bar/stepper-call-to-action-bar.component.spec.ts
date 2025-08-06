import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperCallToActionBarComponent } from './stepper-call-to-action-bar.component';

describe('StepperCallToActionBarComponent', () => {
  let component: StepperCallToActionBarComponent;
  let fixture: ComponentFixture<StepperCallToActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperCallToActionBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperCallToActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
