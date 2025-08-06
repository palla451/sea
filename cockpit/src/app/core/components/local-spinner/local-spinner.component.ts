import { Component } from "@angular/core";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: "app-local-spinner",
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: "./local-spinner.component.html",
  styleUrl: "./local-spinner.component.scss",
})
export class LocalSpinnerComponent {}
