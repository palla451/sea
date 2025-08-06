import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnSettingsSidebarComponent } from './column-settings-sidebar.component';
import { SidebarService } from '../../../features/dashboard/services/dashboard-sidebar.service';
import { FormsModule } from '@angular/forms';

describe('ColumnSettingsSidebarComponent', () => {
  let component: ColumnSettingsSidebarComponent;
  let fixture: ComponentFixture<ColumnSettingsSidebarComponent>;
  let sidebarService: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ColumnSettingsSidebarComponent],
      providers: [SidebarService],
    });
    fixture = TestBed.createComponent(ColumnSettingsSidebarComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close sidebar', () => {
    component.open();
    expect(component.isOpen).toBeTrue();
    component.close();
    expect(component.isOpen).toBeFalse();
  });

  // it('should reset selected columns on cancel', () => {
  //   component.selectedColumns = ['Column1'];
  //   component.reset();
  //   expect(component.selectedColumns.length).toBe(0);
  //   expect(component.isOpen).toBeFalse();
  // });

  // it('should save selected columns and close sidebar', () => {
  //   spyOn(sidebarService, 'updateVisibleColumns');
  //   component.selectedColumns = ['Column1', 'Column2'];
  //   component.save();
  //   expect(sidebarService.updateVisibleColumns).toHaveBeenCalledWith(['Column1', 'Column2']);
  //   expect(component.isOpen).toBeFalse();
  // });
});
