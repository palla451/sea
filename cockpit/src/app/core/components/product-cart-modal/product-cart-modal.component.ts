import { Component, Input, signal } from "@angular/core";
import { CyberProduct } from "../../../features/cyber-product/models/cyber-product.models";

@Component({
  selector: "app-product-cart-modal",
  imports: [],
  templateUrl: "./product-cart-modal.component.html",
  styleUrl: "./product-cart-modal.component.scss",
})
export class ProductCartModalComponent {
  @Input() product!: CyberProduct;
  private _imagesPath = signal<string>("");

  @Input() set imagesPath(imagesPath: string) {
    this._imagesPath.set(imagesPath);
  }
  get imagesPath(): string {
    return this._imagesPath();
  }
}
