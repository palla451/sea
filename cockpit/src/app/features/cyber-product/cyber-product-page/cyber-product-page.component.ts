import { Component, inject, OnInit } from "@angular/core";
import { CyberProductComponentsModule } from "../modules/cyber-product-components.module";
import { RetrieveCyberProductsService } from "../services/retrieve-cyber-products.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { NavigationService } from "../../../core/services/navigation.service";

@Component({
  selector: "app-cyber-product-page",
  imports: [CyberProductComponentsModule],
  templateUrl: "./cyber-product-page.component.html",
  styleUrl: "./cyber-product-page.component.scss",
})
export class CyberProductPageComponent implements OnInit  {
  isCarousel = true;
  imagesPath: string = "assets/svg/cyber-product-logos/";
  retrieveCyberProductsService = inject(RetrieveCyberProductsService);
  products = toSignal(
    this.retrieveCyberProductsService.getCyberProducts(),
    {
      initialValue: [],
    }
  );
  navigationService = inject(NavigationService);

  ngOnInit(): void {
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.ADMINISTRATION);
  }
}
