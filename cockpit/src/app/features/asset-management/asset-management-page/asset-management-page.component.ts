import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { AssetModalComponent } from "../components/asset-modal/asset-modal.component";
import { AssetTableComponent } from "../components/asset-table/asset-table.component";
import { Store } from "@ngrx/store";
import { AssetManagementService } from "../services/asset-management.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AssetManagementComponentsModule } from "../modules/asset-management-components.module";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import { AssetSidebarService } from "../services/asset-sidebar.service";
import { selectAllAssets } from "../../../core/state";
import { assetActions } from "../../../core/state/actions";
import { NavigationService } from "../../../core/services/navigation.service";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";

@Component({
  standalone: true,
  selector: "app-asset-management-page",
  imports: [
    SharedModule,
    AssetModalComponent,
    AssetTableComponent,
    AssetManagementComponentsModule,
  ],
  templateUrl: "./asset-management-page.component.html",
  styleUrl: "./asset-management-page.component.scss",
})
export class AssetManagementPageComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  assetManagementService = inject(AssetManagementService);
  navigationService = inject(NavigationService);
  navigationManagerService = inject(NavigationManagerService);
  sidebarService = inject(AssetSidebarService);

  assets = toSignal(this.store.select(selectAllAssets.selectAssets), {
    initialValue: [],
  });

  ngOnInit(): void {
    this.store.dispatch(assetActions.getAllAssetsList());

    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.assets_mngmt
    );
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.ASSETS);

    this.sidebarService.updateAssetList(this.assets());
  }

  ngOnDestroy(): void {
    this.sidebarService.resetFiltersCount();
  }
} 
