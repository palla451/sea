import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { DecodedToken } from "./models/auth.model";

const keycloak = new Keycloak({
  url: "https://iam.ship.dev.fde.local",
  realm: "fde",
  clientId: "mcsp-cockpit-oidc",
});

@Injectable({ providedIn: "root" })
export class AuthService {
  init(): Promise<boolean> {
    return keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        // silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        if (!authenticated) {
          console.log("Not authenticated, redirecting to Keycloak login");
          keycloak.login({
            idpHint: "keycloak-oidc-shipowner-realm",
            redirectUri: window.location.href,
          });
        } else {
          this.persistTokens();

          keycloak.onTokenExpired = () => {
          this.updateToken();
        };
        }
        return authenticated;
      });
  }

  private updateToken(): void {
    keycloak
      .updateToken(30) // refresh se il token scade in meno di 30s
      .then(refreshed => {
        if (refreshed) {
          console.log('Token aggiornato automaticamente');
        }
      })
      .catch(() => {
        keycloak.logout();
      });
  }


  login(): void {
    keycloak.login({
      idpHint: "keycloak-oidc-shipowner-realm",
      redirectUri: window.location.href,
    });
  }
  logout(): Promise<void> {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("identity_token");
    return keycloak.logout();
  }

  getToken(): string | null {
    this.setIdentityToken();
    return keycloak.token || localStorage.getItem("access_token");
  }

  getIdentityToken(): string | null {
    const identityToken = keycloak.idToken;
    return identityToken ? JSON.parse(atob(identityToken.split(".")[1])) : null;
  }

  setIdentityToken(): void {
    const identityToken = this.getIdentityToken();
    if(identityToken){
      localStorage.setItem("identity_token",JSON.stringify(identityToken))
    }
  }

  getRefreshToken(): string | null {
    return keycloak.refreshToken || localStorage.getItem("refresh_token");
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await keycloak.updateToken(30);
      return refreshed;
    } catch {
      return false;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    return token ? JSON.parse(atob(token.split(".")[1])) : null;
  }

  async ensureTokenReady(): Promise<string | null> {
    if (this.getToken()) {
      return this.getToken();
    }

    const authenticated = await this.init();
    if (authenticated) {
      return this.getToken();
    }

    return null;
  }
  persistTokens(): void {
    keycloak.refreshToken
    if (keycloak.token) {
      localStorage.setItem("access_token", keycloak.token);
    }
    if (keycloak.refreshToken) {
      localStorage.setItem("refresh_token", keycloak.refreshToken);
    }
  }
}
