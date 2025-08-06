import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationManagementPageComponent } from './remediation-management-page.component';

describe('RemediationManagementPageComponent', () => {
  let component: RemediationManagementPageComponent;
  let fixture: ComponentFixture<RemediationManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationManagementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediationManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
