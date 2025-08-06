import { Component, inject, Input } from "@angular/core";
import { IncidentManagementManagerService } from "../../services/incident-management-manager.service";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-incident-manage-button",
  imports: [SharedModule],
  templateUrl: "./incident-manage-button.component.html",
  styleUrl: "./incident-manage-button.component.scss",
})
export class IncidentManageButtonComponent {
  private incidentManagementManagerService = inject(
    IncidentManagementManagerService
  );

  @Input() onManage?: () => void;

  onManageClick() {
    this.incidentManagementManagerService.updateIsBaseReadOnlyModalOpen(true);

    if (this.onManage) {
      this.onManage();
    }
  }
}
