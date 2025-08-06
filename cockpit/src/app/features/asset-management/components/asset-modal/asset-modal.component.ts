import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";
import { GenericModalComponent } from "../../../../core/components/generic-modal/generic-modal.component";
import { TableModalService } from "../../services/table-modal.service";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { Asset } from "../../../../core/models/asset.model";
import { assetActions } from "../../../../core/state/actions";

@Component({
  selector: "app-asset-modal",
  imports: [SharedModule, GenericModalComponent],
  templateUrl: "./asset-modal.component.html",
  styleUrl: "./asset-modal.component.scss",
})
export class AssetModalComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private modalOpenSubscription!: Subscription;
  private tableModalService = inject(TableModalService);

  state: string[] = ["Operational", "Turned Off", "Maintenance", "Compromised"];
  @ViewChild("assetModalBody", { static: true })
  assetModalBody!: TemplateRef<any>;
  asset!: Asset;
  initialState = "";
  showAssetModal: boolean = false;
  selectedState = signal("");
  isSaveEnabled = signal(false);

  ngOnInit(): void {
    this.modalOpenSubscription = this.tableModalService.openModal$.subscribe(
      (assetData) => {
        this.asset = assetData;
        this.initialState = assetData.status;
        this.selectedState.set(assetData.status);
        this.isSaveEnabled.set(false);
        this.showAssetModal = true;
      }
    );
  }
  ngOnDestroy(): void {
    if (this.modalOpenSubscription) {
      this.modalOpenSubscription.unsubscribe();
    }
  }

  closeAssetModal() {
    this.showAssetModal = false;
  }

  onBackClick() {
    this.showAssetModal = false;
  }

  onSave() {
    const newState = this.selectedState();
    if (newState !== this.initialState) {
      const updatedAsset: Asset = {
        ...this.asset,
        status: newState,
      };
      this.store.dispatch(
        assetActions.patchAsset({ newAssetState: updatedAsset })
      );
    }
    this.showAssetModal = false;
  }

  onStateChange() {
    this.isSaveEnabled.set(this.selectedState() !== this.initialState);
  }
}
