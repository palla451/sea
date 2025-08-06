import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFunctionTrendComponent } from './system-function-trend.component';

describe('SystemFunctionTrendComponent', () => {
  let component: SystemFunctionTrendComponent;
  let fixture: ComponentFixture<SystemFunctionTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemFunctionTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemFunctionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
