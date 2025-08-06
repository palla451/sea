import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationTrendComponent } from './remediation-trend.component';

describe('RemediationTrendComponent', () => {
  let component: RemediationTrendComponent;
  let fixture: ComponentFixture<RemediationTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediationTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
