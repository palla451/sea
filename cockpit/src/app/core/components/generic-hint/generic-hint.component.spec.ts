import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericHintComponent } from './generic-hint.component';

describe('GenericHintComponent', () => {
  let component: GenericHintComponent;
  let fixture: ComponentFixture<GenericHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericHintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
