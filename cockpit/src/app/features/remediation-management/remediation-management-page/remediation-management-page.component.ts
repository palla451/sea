import { Component, inject, OnInit } from "@angular/core";
import { RemediationManagementComponentsModule } from "../modules/remediation-management-components.module";
import { incidentRemediationsActions } from "../state/actions";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromIncidentRemediations } from "../state";
import { NavigationService } from "../../../core/services/navigation.service";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { RemediationSidebarService } from "../services/remediation-sidebar.service";

@Component({
  selector: "app-remediation-management-page",
  imports: [RemediationManagementComponentsModule],
  templateUrl: "./remediation-management-page.component.html",
  styleUrl: "./remediation-management-page.component.scss",
})
export class RemediationManagementPageComponent implements OnInit {
  private readonly store = inject(Store);
  navigationService = inject(NavigationService);
  navigationManagerService = inject(NavigationManagerService);
  remesiationsSidebarService = inject(RemediationSidebarService);

  incidentRemediations = toSignal(
    this.store.select(fromIncidentRemediations.selectAllRemediations),
    {
      initialValue: null,
    }
  );

  ngOnInit(): void {
    this.store.dispatch(incidentRemediationsActions.getAllRemediations());

    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.remediations
    );
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.REMEDIATION);

    this.remesiationsSidebarService.updateRemediationList(this.incidentRemediations());
  }
}
