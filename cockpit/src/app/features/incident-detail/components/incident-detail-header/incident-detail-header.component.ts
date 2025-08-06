import { Component, inject } from "@angular/core";
import { SharedModule } from "../../../../shared/shared.module";
import { toSignal } from "@angular/core/rxjs-interop";
import { SidebarService } from "../../../dashboard/services/dashboard-sidebar.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  fromIncidentDetail,
  selectUniqueShipFunctionsFromFirstIncident,
} from "../../../../core/state";
import { IncidentDetail } from "../../models/incident-detail.models";
import { selectAllVesselMacroFunctions } from "../../../dashboard/state";
import { FunctionNode } from "../../../dashboard/models/dashboard.models";

@Component({
  selector: "app-incident-detail-header",
  imports: [SharedModule],
  templateUrl: "./incident-detail-header.component.html",
  styleUrl: "./incident-detail-header.component.scss",
})
export class IncidentDetailHeaderComponent {
  dasboardSidebarService = inject(SidebarService);
  router = inject(Router);
  private readonly store = inject(Store);
  incidentDetailInitiator = toSignal(
    this.dasboardSidebarService.incidentDetailInitiator,
    { initialValue: "" }
  );

  incidentDetail = toSignal(
    this.store.select(fromIncidentDetail.selectIncidentDetailBundle),
    {
      initialValue: [],
    }
  );

  mainShipMacroFunctions = toSignal(
    this.store.select(selectAllVesselMacroFunctions),
    {
      initialValue: [],
    }
  );

  getAllIncidentUniqueFunctions = toSignal(
    this.store.select(selectUniqueShipFunctionsFromFirstIncident),
    {
      initialValue: [],
    }
  );

  get incidentData(): IncidentDetail {
    return this.incidentDetail()[0] as IncidentDetail;
  }

  // getIncidentImpactedSystems(): string {
  //   let incidentImpactedFunctionList = "";
  //   const selectedFunctionNodes: FunctionNode[] =
  //     this.mainShipMacroFunctions().filter((mainShipMacroFunction) =>

  //       this.getAllIncidentUniqueFunctions().some(
  //         (func) => {
  //           return func.function.toLowerCase() ===
  //           mainShipMacroFunction.name.toLowerCase()
  //         }

  //       )
  //     );
  //   incidentImpactedFunctionList = selectedFunctionNodes
  //     .map((selectedFunctionNode) => selectedFunctionNode.name)
  //     .join(", ");
  //   return incidentImpactedFunctionList;
  // }

  getIncidentImpactedSystems(): string {
    const incidentFunctions = this.getAllIncidentUniqueFunctions().map((f) =>
      f.function.toLowerCase()
    );

    const matchedNodes: FunctionNode[] = this.mainShipMacroFunctions().filter(
      (node) => this.nodeOrDescendantMatches(node, incidentFunctions)
    );

    return matchedNodes.map((n) => n.name).join(", ");
  }

  /**
   * Controlla se il nodo o uno dei suoi figli ha un name presente nella lista dei nomi incidentati.
   */
  private nodeOrDescendantMatches(
    node: FunctionNode,
    incidentFunctions: string[]
  ): boolean {
    if (incidentFunctions.includes(node.name.toLowerCase())) {
      return true;
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child) =>
        this.nodeOrDescendantMatches(child, incidentFunctions)
      );
    }

    return false;
  }

  getAlertSeverityColor(alertLevel: string): string {
    let returningLevel = "";

    switch (alertLevel.toLowerCase()) {
      case "high":
      case "critical":
        returningLevel = "#F64D4D";
        break;
      case "medium":
        returningLevel = "#FF8826";
        break;
      case "low":
        returningLevel = "#FFCF26";
        break;
    }

    return returningLevel;
  }

  getAlertSeverityShadow(alertLevel: string): string {
    let returningShadow = "";

    switch (alertLevel.toLowerCase()) {
      case "high":
      case "critical":
        returningShadow = "0 0 0 2px rgba(246, 77, 77, 0.2)";
        break;
      case "medium":
        returningShadow = "0 0 0 2px rgba(255, 136, 38, 0.2)";
        break;
      case "low":
        returningShadow = "0 0 0 2px rgba(255, 207, 38, 0.2)";
        break;
    }

    return returningShadow;
  }

  navigateToIncidentDetailInitiator() {
    switch (this.incidentDetailInitiator()) {
      case "dashboard":
        this.router.navigate(["/overview"]);
        break;

      case "history":
        this.router.navigate(["/history"]);
        break;

      case "incidents":
        this.router.navigate(["/incidents"]);
        break;

      case "remediations":
        this.router.navigate(["/remediations"]);
        break;
    }
  }

  capitalizeFirstLetter(input: string): string {
    if (!input) return "";
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
}
