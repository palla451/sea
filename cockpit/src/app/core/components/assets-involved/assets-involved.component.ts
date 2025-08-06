import { Component, inject } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { IncidentDetailAsset } from "../../../features/incident-detail/models/incident-detail.models";
import { Store } from "@ngrx/store";
import { selectAllAssetsInvolved } from "../../state";
import { toSignal } from "@angular/core/rxjs-interop";
import { IconAssetsInvolvedPathMap } from "../../models/iconDictionary.model";

@Component({
  selector: "app-assets-involved",
  imports: [SharedModule],
  templateUrl: "./assets-involved.component.html",
  styleUrl: "./assets-involved.component.scss",
})
export class AssetsInvolvedComponent {
  private readonly store = inject(Store);
  iconAssetsInvolvedMap = IconAssetsInvolvedPathMap;
  assets: () => IncidentDetailAsset[] = toSignal(
    this.store.select(selectAllAssetsInvolved),
    {
      initialValue: [],
    }
  );
}
