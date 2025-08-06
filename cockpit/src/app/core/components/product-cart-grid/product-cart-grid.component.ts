import { Component, Input, signal } from "@angular/core";
import { CyberProduct } from "../../../features/cyber-product/models/cyber-product.models";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "../../../shared/shared.module";
import { BaseReadonlyModalComponent } from "../base-readonly-modal/base-readonly-modal.component";
import { ProductCartModalComponent } from "../product-cart-modal/product-cart-modal.component";
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: "app-product-cart-grid",
  imports: [
    SharedModule,
    ButtonModule,
    ProductCardComponent,
    ProductCartModalComponent,
    ProductCardComponent,
  ],
  templateUrl: "./product-cart-grid.component.html",
  styleUrl: "./product-cart-grid.component.scss",
})
export class ProductCartGridComponent {
  responsiveOptions: any[] | undefined;
  currentTitle: string = "";
  currentSubtitle: string = "";
  showFullCard: boolean = false;

  private _products = signal<CyberProduct[]>([]);
  private _imagesPath = signal<string>("");
  selectedProduct = signal<CyberProduct | null>(null);

  @Input() set imagesPath(imagesPath: string) {
    this._imagesPath.set(imagesPath);
  }

  @Input() set products(cyberProducts: CyberProduct[]) {
    this._products.set(cyberProducts);
  }

  get products(): CyberProduct[] {
    return this._products();
  }

  get imagesPath(): string {
    return this._imagesPath();
  }

  toggleFullCard(product: CyberProduct): void {
    this.selectedProduct.set(product);
    this.showFullCard = true;
  }
  manageModalClosedState(): void {
    this.showFullCard = false;
    this.selectedProduct.set(null);
  }

  openProductLink(product: CyberProduct): void {
    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    }
  }
}
