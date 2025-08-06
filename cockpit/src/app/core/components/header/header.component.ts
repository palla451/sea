import { Component, computed, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MenubarModule } from "primeng/menubar";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { TieredMenuModule } from "primeng/tieredmenu";
import { StyleClassModule } from "primeng/styleclass";
import { RippleModule } from "primeng/ripple";
import { NavigationService } from "../../services/navigation.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthService } from "../../../auth/auth.service";
import { authActions } from "../../../auth/state/actions";
import { Store } from "@ngrx/store";
import { hasAdminExclusiveAccess } from "../../../auth/state";
import { catchError, EMPTY, noop, tap } from "rxjs";
import { ApiService } from "../../services/api.service";
import { API_ENDPOINTS } from "../../../../environments/api-endpoints";
import { HttpParams } from "@angular/common/http";
import { SelectModule } from "primeng/select";
import { TranslocoService } from "@jsverse/transloco";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    AvatarModule,
    ButtonModule,
    TieredMenuModule,
    StyleClassModule,
    RippleModule,
    SelectModule,
    SharedModule,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  private store = inject(Store);
  private apiService = inject(ApiService);
  activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  appName = "MCSP";
  lastPathSegment = "";
  navigationManagerService = inject(NavigationService);
  isCyberResilienceOVVisible = toSignal(
    this.navigationManagerService.cyberResilienceOVSelected$
  );

  activeMenuItem = toSignal(
    this.navigationManagerService.getSelectedAppMenu(),
    {
      initialValue: "Overview",
    }
  );

  hasAdminExclusiveAccess$ = this.store.select(hasAdminExclusiveAccess);
  hasAdminExclusiveAccess = toSignal(
    this.store.select(hasAdminExclusiveAccess),
    {
      initialValue: false,
    }
  );

  user = {
    name: "LORENZO CARAVAGLIA",
    role: "OFFSHORE SECURITY MANAGER",
    avatar: "assets/jpg/omer-haktan-bulut-v_Ya3H5u4qo-unsplash 1.jpg",
  };

  navItems = [
    { label: "navbar.overview", routerLink: "/overview" },
    { label: "navbar.assets", routerLink: "/asset-management" },
    { label: "navbar.remediation", routerLink: "/remediations" },
    { label: "navbar.incidents", routerLink: "/incidents" },
    { label: "navbar.history", routerLink: "/history" },
    { label: "navbar.administration", routerLink: "/administration" },
  ];

  languageOptions = [
    { label: "ENG", value: "en" },
    { label: "ITA", value: "it" },
  ];
  selectedLanguage = this.translocoService.getActiveLang();
  ngOnInit(): void {
    const savedLang = localStorage.getItem("appLang");
    if (savedLang && (savedLang === "en" || savedLang === "it")) {
      this.selectedLanguage = savedLang;
      this.translocoService.setActiveLang(savedLang);
    } else {
      this.selectedLanguage = this.translocoService.getActiveLang();
    }
  }

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem("appLang", lang);
  }
  /**
   * Calculate active indicator position
   */
  activeIndicatorPosition = computed(() => {
    const index = this.navItems.findIndex(
      (item) => item.label === this.activeMenuItem()
    );
    return {
      transform: `translateX(${index * 100}%)`,
      width: `calc(100% / ${this.navItems.length})`,
    };
  });

  isUserEnabledToAdminPage = computed(() => {
    return this.hasAdminExclusiveAccess();
  });

  setActiveMenuItem(label: string) {
    this.navigationManagerService.updateSelectedAppMenu(label);
    if (label === "Overview" && this.isCyberResilienceOVVisible() === true) {
      this.navigationManagerService.closeCyberResilienceOVPage();
    }
  }

  /**
   * Calcola la posizione e larghezza dell'indicatore
   */
  activeIndicatorStyle = computed(() => {
    const itemCount = this.navItems.length;
    const activeIndex = this.navItems.findIndex(
      (item) => item.label === this.activeMenuItem()
    );
    const itemWidthPercent = 100 / itemCount;

    return {
      "width.%": itemWidthPercent,
      "left.%": activeIndex * itemWidthPercent,
      transition: "left 0.4s cubic-bezier(0.35, 0, 0.25, 1)",
    };
  });

  navigateToProfile() {
    console.log("Navigate to profile");
    // Implement navigation logic
  }

  logout() {
    localStorage.removeItem("appLang");
    const apiurl = API_ENDPOINTS["logout_to_be_cache_cleanup"];
    let params = new HttpParams();

    const userLoggedUsername = JSON.parse(
      localStorage.getItem("identity_token") ?? ""
    );

    if (userLoggedUsername && userLoggedUsername?.preferred_username) {
      params = params.set("username", userLoggedUsername?.preferred_username);
    }

    this.apiService
      .get<any>(apiurl, params)
      .pipe(
        tap(() => {
          console.log("logout verso il be in success");
          this.store.dispatch(authActions.logout());
        }),
        catchError((err) => {
          console.error("Errore durante il logout:", err);
          this.store.dispatch(authActions.logout());
          return EMPTY;
        })
      )
      .subscribe(noop);
  }

  getLoggedUserEmail() {
    const identiyToken = JSON.parse(
      localStorage.getItem("identity_token") ?? ""
    );
    return identiyToken?.email ?? "";
  }

  getLoggedUserRole(): string {
    const allLoggedUserRoles: string[] =
      this.authService.getDecodedToken()?.resource_access["mcsp-cockpit-oidc"]
        .roles ?? [];
    let currentUserRole = "";
    if (
      allLoggedUserRoles.some(
        (role) => role.toLowerCase() === "cockpit-administrator"
      )
    ) {
      currentUserRole = "Cockpit Administrator";
    } else if (
      allLoggedUserRoles.some(
        (role) => role.toLowerCase() === "cockpit-operator"
      )
    ) {
      currentUserRole = "Cockpit Operator";
    } else if (
      allLoggedUserRoles.some(
        (role) => role.toLowerCase() === "cockpit-analyst"
      )
    ) {
      currentUserRole = "Cockpit Analyst";
    }

    return currentUserRole;
  }
}
