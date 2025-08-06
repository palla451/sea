import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchableMultiselectDropdownComponent } from "./searchable-multiselect-dropdown.component";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { of, Subject } from "rxjs";
import { By } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { CheckboxModule } from "primeng/checkbox";

describe("SearchableMultiselectDropdownComponent", () => {
  let component: SearchableMultiselectDropdownComponent;
  let fixture: ComponentFixture<SearchableMultiselectDropdownComponent>;
  let sidebarService: SidebarService;

  beforeEach(() => {
    const sidebarServiceMock = {
      getIncidentsDescriptionOptions: jasmine
        .createSpy()
        .and.returnValue(of(["desc1", "desc2", "desc3"])),
      getIncidentsDeckOptions: jasmine
        .createSpy()
        .and.returnValue(of(["deck1", "deck2"])),
      getIncidentsFrameOptions: jasmine
        .createSpy()
        .and.returnValue(of(["frame1", "frame2"])),
      getIncidentsMVZOptions: jasmine
        .createSpy()
        .and.returnValue(of(["10", "20", "30"])),
      resetTriggered: new Subject<void>(),
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        MultiSelectModule,
        CheckboxModule,
      ],
      providers: [{ provide: SidebarService, useValue: sidebarServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableMultiselectDropdownComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should filter description options based on search term", () => {
    component.searchTerm = "desc1";
    component.filterOptions();
    fixture.detectChanges();

    expect(component.filteredDescriptionOptions).toEqual(["desc1"]);
  });

  it("should toggle dropdown visibility", () => {
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTrue();

    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it("should emit descriptionsSelectionChange when an option is selected", () => {
    spyOn(component.descriptionsSelectionChange, "emit");

    component.toggleSelection("desc1", "description");

    expect(component.descriptionsSelectionChange.emit).toHaveBeenCalledWith(
      new Set(["desc1"])
    );
  });

  it("should call getIncidentsDescriptionOptions when filtering options", () => {
    component.filterOptions();

    expect(sidebarService.getIncidentsDescriptionOptions).toHaveBeenCalled();
    expect(sidebarService.getIncidentsDeckOptions).toHaveBeenCalled();
    expect(sidebarService.getIncidentsFrameOptions).toHaveBeenCalled();
  });
});
