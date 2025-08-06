import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductCardComponent } from "./product-card.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("ProductCardComponent", () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open modal", () => {
    component.openModal();
    fixture.detectChanges();
    expect(component.isModalVisible).toBeTrue();
  });

  it("should close modal and emit event", () => {
    spyOn(component.modalClosed, "emit");

    component.openModal();
    fixture.detectChanges();
    expect(component.isModalVisible).toBeTrue();

    component.closeModal();
    fixture.detectChanges();

    expect(component.isModalVisible).toBeFalse();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it("should update modalTitle input", () => {
    component.modalTitle = "Test Title";
    fixture.detectChanges();
    expect(component.modalTitle).toBe("Test Title");
  });

  it("should update isModalVisible input", () => {
    component.isModalVisible = true;
    fixture.detectChanges();
    expect(component.isModalVisible).toBeTrue();

    component.isModalVisible = false;
    fixture.detectChanges();
    expect(component.isModalVisible).toBeFalse();
  });
});
