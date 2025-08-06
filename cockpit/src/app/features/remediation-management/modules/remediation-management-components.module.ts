import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { RemediationManagementTableComponent } from "../components/remediation-management-table/remediation-management-table.component";

@NgModule({
  declarations: [],
  imports: [SharedModule, RemediationManagementTableComponent],
  exports: [SharedModule, RemediationManagementTableComponent],
})
export class RemediationManagementComponentsModule {}
