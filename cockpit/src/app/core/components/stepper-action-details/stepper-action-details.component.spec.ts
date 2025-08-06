import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperActionDetailsComponent } from './stepper-action-details.component';

describe('StepperActionDetailsComponent', () => {
  let component: StepperActionDetailsComponent;
  let fixture: ComponentFixture<StepperActionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperActionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperActionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
