import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationActionTypesComponent } from './remediation-action-types.component';

describe('RemediationActionTypesComponent', () => {
  let component: RemediationActionTypesComponent;
  let fixture: ComponentFixture<RemediationActionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemediationActionTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemediationActionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
