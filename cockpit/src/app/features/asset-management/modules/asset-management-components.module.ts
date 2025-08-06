import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { IncidentOverviewTableComponent } from "../../dashboard/components/dashboard-components/incident-overview-table/incident-overview-table.component";
import { AssetTableComponent } from "../components/asset-table/asset-table.component";
import { GenericModalComponent } from "../../../core/components/generic-modal/generic-modal.component";

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    AssetTableComponent,
    IncidentOverviewTableComponent,
    GenericModalComponent,
  ],
  exports: [
    SharedModule,
    AssetTableComponent,
    IncidentOverviewTableComponent,
    GenericModalComponent,
  ],
})
export class AssetManagementComponentsModule {}
