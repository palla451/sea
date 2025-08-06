import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssetTableComponent } from "./asset-table.component";
import { TableModalService } from "../../services/table-modal.service";
import { of } from "rxjs";
import { AssetSidebarService } from "../../services/asset-sidebar.service";

xdescribe("AssetTableComponent", () => {
  let component: AssetTableComponent;
  let fixture: ComponentFixture<AssetTableComponent>;
  let mockTableModalService: jasmine.SpyObj<TableModalService>;

  beforeEach(async () => {
    mockTableModalService = jasmine.createSpyObj("TableModalService", [
      "openModal",
    ]);
    const mockSidebarService = {
      visibleColumnsAssets$: of([
        { field: "name", header: "NAME", visible: true, sortable: true },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [AssetTableComponent],
      providers: [
        { provide: TableModalService, useValue: mockTableModalService },
        { provide: AssetSidebarService, useValue: mockSidebarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should set and get assets and reset first page", () => {
    component.assets = [{ name: "Asset1" } as any];
    fixture.detectChanges();
    expect(component.assets.length).toBe(1);
    expect(component.first()).toBe(0);
  });
});
