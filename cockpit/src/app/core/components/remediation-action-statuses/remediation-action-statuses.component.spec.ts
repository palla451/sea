import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationActionStatusesComponent } from './remediation-action-statuses.component';

describe('RemediationActionStatusesComponent', () => {
  let component: RemediationActionStatusesComponent;
  let fixture: ComponentFixture<RemediationActionStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationActionStatusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediationActionStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
