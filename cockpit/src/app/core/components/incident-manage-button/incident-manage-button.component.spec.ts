import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentManageButtonComponent } from './incident-manage-button.component';

describe('IncidentManageButtonComponent', () => {
  let component: IncidentManageButtonComponent;
  let fixture: ComponentFixture<IncidentManageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentManageButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentManageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
