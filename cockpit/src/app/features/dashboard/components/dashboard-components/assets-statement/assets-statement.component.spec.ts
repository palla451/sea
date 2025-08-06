import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsStatementComponent } from './assets-statement.component';

describe('AssetsStatementComponent', () => {
  let component: AssetsStatementComponent;
  let fixture: ComponentFixture<AssetsStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
