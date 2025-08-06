import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, HeaderComponent],
  templateUrl: "./main-layout.component.html",
})
export class MainLayoutComponent {}
