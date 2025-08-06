import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseReadonlyModalComponent } from './base-readonly-modal.component';

describe('BaseReadonlyModalComponent', () => {
  let component: BaseReadonlyModalComponent;
  let fixture: ComponentFixture<BaseReadonlyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseReadonlyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseReadonlyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
