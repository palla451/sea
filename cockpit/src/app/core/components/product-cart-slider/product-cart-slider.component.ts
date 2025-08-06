import { Component, Input, OnInit, signal } from "@angular/core";
import { CyberProduct } from "../../../features/cyber-product/models/cyber-product.models";
import { CarouselModule } from "primeng/carousel";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-product-cart-slider",
  imports: [CarouselModule, SharedModule, ButtonModule],
  templateUrl: "./product-cart-slider.component.html",
  styleUrl: "./product-cart-slider.component.scss",
})
export class ProductCartSliderComponent implements OnInit {
  responsiveOptions: any[] | undefined;
  currentTitle: string = "";
  currentSubtitle: string = "";

  private _products = signal<CyberProduct[]>([]);
  private _imagesPath = signal<string>("");

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

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: "1400px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "1199px",
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "575px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
    this.currentTitle = this.products?.[0]?.name || "";
    this.currentSubtitle = this.products?.[0]?.description || "";
  }

  handlePageChange(event: { page?: number }) {
    if (typeof event.page === "number") {
      const product = this.products[event.page++];
      if (product) {
        this.currentTitle = product?.name;
        this.currentSubtitle = product?.description;
      }
    }
  }
}
