import { Component, effect, inject, OnInit } from "@angular/core";
import { IncidentDetailComponentsModule } from "../components/incident-detail-components.module";
import { IncidentDetailService } from "../services/incident-detail.service";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromIncidentDetail } from "../../../core/state";
import { NavigationService } from "../../../core/services/navigation.service";
import { AppMenuListEnum } from "../../../core/enums/app-menu-list";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { incidentDetailActions } from "../../../core/state/actions";
import { shipFunctionsActions } from "../../dashboard/state/actions";

@Component({
  selector: "app-incident-detail-page",
  imports: [IncidentDetailComponentsModule],
  templateUrl: "./incident-detail-page.component.html",
  styleUrl: "./incident-detail-page.component.scss",
})
export class IncidentDetailPageComponent implements OnInit {
  timelineIncidentsService = inject(IncidentDetailService);
  private readonly store = inject(Store);
  isAccordionOpen: boolean = true;
  navigationService = inject(NavigationService);
  activatedRoute = inject(ActivatedRoute);

  incidentDetail = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  paramId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get("id") ?? ""))
  );

  constructor() {
    this.store.dispatch(shipFunctionsActions.getAllShipFunctions());
    
    effect(() => {
      this.store.dispatch(
        incidentDetailActions.getAllIncidentDetail({
          incidentId: String(this.paramId()),
        })
      );
    });
  }

  ngOnInit(): void {
    this.navigationService.updateSelectedAppMenu(AppMenuListEnum.INCIDENT);
  }
}
