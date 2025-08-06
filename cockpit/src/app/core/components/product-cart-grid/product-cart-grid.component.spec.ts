import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductCartGridComponent } from "./product-cart-grid.component";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";

describe("ProductCartGridComponent", () => {
  let component: ProductCartGridComponent;
  let fixture: ComponentFixture<ProductCartGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCartGridComponent, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCartGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
