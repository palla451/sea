import { Component, inject, OnInit, signal } from "@angular/core";
import { RemediationManagementComponentsModule } from "../modules/remediation-management-components.module";
import { incidentRemediationsActions } from "../state/actions";
import { Store } from "@ngrx/store";
import { fromIncidentRemediations } from "../state";
import { NavigationService } from "../../../core/services/navigation.service";
import { NavigationManagerService } from "../../../core/services/navigation-manager.service";
import { NavigationTargetEnum } from "../../../core/enums/navigation-targets.enum";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { RemediationSidebarService } from "../services/remediation-sidebar.service";
import { filter, noop, tap } from "rxjs";
import { isNonNull } from "../../../core/utils/rxjs-operators/noNullOperator";
import { RemediationItem } from "../models/remediation-management.models";

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

  incidentRemediations = signal<RemediationItem[]>([]);

  ngOnInit(): void {
    this.store.dispatch(incidentRemediationsActions.getAllRemediations());
    this.getAllRemediationList();

    this.navigationManagerService.updateCurrentHostingPage(
      NavigationTargetEnum.remediations
    );
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.REMEDIATION);
  }

  private getAllRemediationList():void {
    this.store.select(fromIncidentRemediations.selectAllRemediations).pipe(
      filter(isNonNull),
      tap(allRemediationList => {
        if(allRemediationList){
          this.remesiationsSidebarService.updateRemediationList(allRemediationList);
          this.incidentRemediations.set(allRemediationList);
        }
      })
    ).subscribe(noop);
  }
}
