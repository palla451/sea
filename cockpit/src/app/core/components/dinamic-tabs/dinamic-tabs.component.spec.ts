import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicTabsComponent } from './dinamic-tabs.component';

describe('DinamicTabsComponent', () => {
  let component: DinamicTabsComponent;
  let fixture: ComponentFixture<DinamicTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinamicTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinamicTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
