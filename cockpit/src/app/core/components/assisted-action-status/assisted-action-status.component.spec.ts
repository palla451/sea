import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistedActionStatusComponent } from './assisted-action-status.component';

describe('AssistedActionStatusComponent', () => {
  let component: AssistedActionStatusComponent;
  let fixture: ComponentFixture<AssistedActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistedActionStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistedActionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
