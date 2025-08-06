import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailHeaderComponent } from './incident-detail-header.component';
import { getTranslocoModule } from '../../../../shared/transloco-testing.module';

describe('IncidentDetailHeaderComponent', () => {
  let component: IncidentDetailHeaderComponent;
  let fixture: ComponentFixture<IncidentDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailHeaderComponent, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
