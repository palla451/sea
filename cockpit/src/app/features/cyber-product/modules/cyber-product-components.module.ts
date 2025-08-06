import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { CarouselModule } from "primeng/carousel";
import { ButtonModule } from "primeng/button";
import { InputSwitchModule } from "primeng/inputswitch";
import { ProductCartSliderComponent } from "../../../core/components/product-cart-slider/product-cart-slider.component";
import { ProductCartGridComponent } from "../../../core/components/product-cart-grid/product-cart-grid.component";

@NgModule({
  declarations: [],
  imports: [
    CarouselModule,
    SharedModule,
    ButtonModule,
    InputSwitchModule,
    ProductCartSliderComponent,
    ProductCartGridComponent,
  ],
  exports: [
    CarouselModule,
    SharedModule,
    ButtonModule,
    InputSwitchModule,
    ProductCartSliderComponent,
    ProductCartGridComponent,
  ],
})
export class CyberProductComponentsModule {}
