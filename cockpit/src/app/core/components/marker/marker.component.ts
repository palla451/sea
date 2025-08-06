import { Component, Input } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import {
  IconActionPathMap,
  IconEventPathMap,
  IconKey,
} from "../../models/iconDictionary.model";

@Component({
  selector: "app-marker",
  imports: [SharedModule],
  templateUrl: "./marker.component.html",
  styleUrl: "./marker.component.scss",
})
export class MarkerComponent {
  @Input() active = false;
  @Input() shape: "diamond" | "rounded" = "rounded";
  @Input() icon: string = "";
}
