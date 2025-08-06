import { Routes } from "@angular/router";
import { authGuard } from "./auth/guards/auth.guard";
import { roleGuard } from "./auth/guards/role.guard";

export const routes: Routes = [
  {
    path: "overview",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/dashboard/routes/dashboard.routes").then(
        (m) => m.dashboardRoutes
      ),
  },
  {
    path: "asset-management",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/asset-management/routes/asset-management.routes").then(
        (m) => m.assetManagementRoutes
      ),
  },
  {
    path: "remediations",
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        "./features/remediation-management/routes/remediation-management.routes"
      ).then((m) => m.remediationManagementRoutes),
  },
  {
    path: "incident-detail/:id",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/incident-detail/routes/incident-detail.routes").then(
        (m) => m.incidentDetailRoutes
      ),
  },
  {
    path: "administration",
    canActivate: [authGuard, roleGuard(["cockpit-administrator"])],
    loadChildren: () =>
      import("./features/cyber-product/routes/cyber-products.routes").then(
        (m) => m.cyberProductsRoutes
      ),
  },
  {
    path: "history",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/history/routes/history.routes").then(
        (m) => m.historyRoutes
      ),
  },
  {
    path: "incidents",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/open-incidents/routes/open-incidents.routes").then(
        (m) => m.openIncidentsRoutes
      ),
  },
  {
    path: "",
    redirectTo: "overview",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "overview",
  },
];
