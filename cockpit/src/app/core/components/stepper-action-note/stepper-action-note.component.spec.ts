import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperActionNoteComponent } from './stepper-action-note.component';

describe('StepperActionNoteComponent', () => {
  let component: StepperActionNoteComponent;
  let fixture: ComponentFixture<StepperActionNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperActionNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperActionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
