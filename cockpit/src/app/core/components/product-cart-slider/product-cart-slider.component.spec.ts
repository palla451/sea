import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCartSliderComponent } from './product-cart-slider.component';

describe('ProductCartSliderComponent', () => {
  let component: ProductCartSliderComponent;
  let fixture: ComponentFixture<ProductCartSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCartSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCartSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
