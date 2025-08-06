import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollbackModalComponent } from './rollback-modal.component';

describe('RollbackModalComponent', () => {
  let component: RollbackModalComponent;
  let fixture: ComponentFixture<RollbackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollbackModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
