import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TreeViewNodeComponent } from "./tree-view-node.component";
import { AccordionItem } from "../../models/tree-view.models";
import { CommonModule } from "@angular/common";

describe("TreeViewNodeComponent", () => {
  let component: TreeViewNodeComponent;
  let fixture: ComponentFixture<TreeViewNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TreeViewNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeViewNodeComponent);
    component = fixture.componentInstance;
    component.data = {
      id: "1",
      title: "Test",
      percentage: 100,
      children: [],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnChanges", () => {
    it("should set isExpanded to true if initiallyExpanded is true", () => {
      component.initiallyExpanded = true;
      component.ngOnChanges();
      expect(component.isExpanded).toBeTrue();
    });

    it("should not change isExpanded if initiallyExpanded is false", () => {
      component.initiallyExpanded = false;
      component.ngOnChanges();
      expect(component.isExpanded).toBeFalse();
    });
  });

  describe("toggle", () => {
    it("should toggle isExpanded", () => {
      component.isExpanded = false;
      component.toggle();
      expect(component.isExpanded).toBeTrue();

      component.toggle();
      expect(component.isExpanded).toBeFalse();
    });
  });

  describe("calculateWholeIntegrity", () => {
    it("should return 100 if items are empty or null", () => {
      expect(component.calculateWholeIntegrity([])).toBe(100);
      expect(component.calculateWholeIntegrity(null as any)).toBe(100);
    });

    it("should return 100 if no valid percentages are found", () => {
      const items: AccordionItem[] = [
        { id: "1", title: "Item 1", percentage: undefined },
      ];
      expect(component.calculateWholeIntegrity(items)).toBe(100);
    });

    it("should correctly calculate the average integrity", () => {
      const items: AccordionItem[] = [
        { id: "1", title: "Item 1", percentage: 50 },
        { id: "2", title: "Item 2", percentage: 100 },
      ];
      expect(component.calculateWholeIntegrity(items)).toBe(75);
    });
  });

  describe("trackByFn", () => {
    it("should return the item's ID if present", () => {
      const item: AccordionItem = {
        id: "123",
        title: "Test Item",
        percentage: 50,
      };
      expect(component.trackByFn(item)).toBe("123");
    });
  });
});
