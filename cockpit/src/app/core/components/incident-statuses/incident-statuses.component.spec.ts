import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentStatusesComponent } from './incident-statuses.component';

describe('IncidentStatusesComponent', () => {
  let component: IncidentStatusesComponent;
  let fixture: ComponentFixture<IncidentStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentStatusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
