// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HeaderComponent } from './header.component';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [HeaderComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { MenubarModule } from "primeng/menubar";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { TieredMenuModule } from "primeng/tieredmenu";
import { StyleClassModule } from "primeng/styleclass";
import { RippleModule } from "primeng/ripple";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

class MockActivatedRoute {
  navigateByUrl(url: string) {
    return url;
  }

  serializeUrl(url: string) {
    return url;
  }
}

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MenubarModule,
        AvatarModule,
        ButtonModule,
        TieredMenuModule,
        StyleClassModule,
        RippleModule,
      ],
      providers: [{ provide: ActivatedRoute, useClass: MockActivatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the application name", () => {
    const appNameElement: HTMLElement = fixture.debugElement.query(
      By.css(".header__app-brand__app-name")
    ).nativeElement;
    expect(appNameElement.textContent).toContain("MCSP");
  });

  it("should render the correct number of navigation items", () => {
    const menuItems = fixture.debugElement.queryAll(
      By.css(".header__nav-container__nav-list__nav-item")
    );
    expect(menuItems.length).toBe(component.navItems.length);
  });

  it("should set the active menu item correctly when clicked", () => {
    const menuItems = fixture.debugElement.queryAll(
      By.css(".header__nav-container__nav-list__nav-item")
    );

    menuItems[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.activeMenuItem()).toBe("ASSETS");
  });

  xit("should update the active indicator position when the active menu changes", () => {
    component.setActiveMenuItem("REMEDIATION");
    fixture.detectChanges();

    const indicator: DebugElement = fixture.debugElement.query(
      By.css(".active-indicator")
    );
    expect(indicator.styles["left"]).toBe(
      `${(2 / component.navItems.length) * 100}%`
    );
  });

  xit("should call navigateToProfile when profile is clicked", () => {
    spyOn(component, "navigateToProfile");

    const profileButton = fixture.debugElement.query(By.css(".profile-button"));
    profileButton.nativeElement.click();

    expect(component.navigateToProfile).toHaveBeenCalled();
  });

  it("should call logout when logout button is clicked", () => {
    spyOn(component, "logout");

    const logoutButton = fixture.debugElement.query(
      By.css(".header__profile-section__logout-button")
    );
    logoutButton.nativeElement.click();

    expect(component.logout).toHaveBeenCalled();
  });
});
