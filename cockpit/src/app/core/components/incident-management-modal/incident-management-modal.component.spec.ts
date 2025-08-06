import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentManagementModalComponent } from './incident-management-modal.component';

describe('IncidentManagementModalComponent', () => {
  let component: IncidentManagementModalComponent;
  let fixture: ComponentFixture<IncidentManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentManagementModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
