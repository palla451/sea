import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationManagementTableComponent } from './remediation-management-table.component';

describe('RemediationManagementTableComponent', () => {
  let component: RemediationManagementTableComponent;
  let fixture: ComponentFixture<RemediationManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationManagementTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediationManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
