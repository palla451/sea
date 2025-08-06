import { Component, Input } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { IconEventPathMap } from "../../models/iconDictionary.model";

@Component({
  selector: "app-sidebar-accordion",
  imports: [SharedModule],
  templateUrl: "./sidebar-accordion.component.html",
  styleUrl: "./sidebar-accordion.component.scss",
})
export class SidebarAccordionComponent {
  iconEventMap = IconEventPathMap;
  isOpen = false;
  @Input() accordionTitle!: string;
  @Input() variant: "sidebar" | "timeline" | "remediationOverview" = "sidebar";
  @Input() eventStatus?: string;

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }
}
