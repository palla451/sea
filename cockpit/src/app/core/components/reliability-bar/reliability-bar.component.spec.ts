import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliabilityBarComponent } from './reliability-bar.component';

describe('ReliabilityBarComponent', () => {
  let component: ReliabilityBarComponent;
  let fixture: ComponentFixture<ReliabilityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReliabilityBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReliabilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
