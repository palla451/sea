import { Component, computed, inject, Input, signal } from "@angular/core";
import { IncidentDecks } from "../../state";
import { IncidentDetailAsset } from "../../../features/incident-detail/models/incident-detail.models";
import { toSignal } from "@angular/core/rxjs-interop";
import { IncidentDetailManagerService } from "../../../features/incident-detail/services/incident-detail-manager.service";
import { CommonModule } from "@angular/common";
import { LocalSpinnerComponent } from "../local-spinner/local-spinner.component";

@Component({
  selector: "app-svg-viewer",
  imports: [CommonModule, LocalSpinnerComponent],
  templateUrl: "./svg-viewer.component.html",
  styleUrl: "./svg-viewer.component.scss",
})
export class SvgViewerComponent {
  private _selectedDeck = signal<IncidentDecks | undefined>(undefined);
  incidentDetailDeckTopView = signal<string>("");
  private incidentDetailManagerService = inject(IncidentDetailManagerService);
  assetsByCurrentlySelectedDeck = toSignal(
    this.incidentDetailManagerService.assetsByCurrentlySelectedDeck,
    {
      initialValue: [],
    }
  );

  private _viewBoxLength = signal<number>(0);
  private _viewBoxHeight = signal<number>(0);
  private _zeroFrameCompensation = signal<number>(0);
  private _lastFrame = signal<number>(0);

  incidentDetailSelectedSeverity = toSignal(
    this.incidentDetailManagerService.incidentDetailSelectedSeverity,
    {
      initialValue: "",
    }
  );

  @Input() set viewBoxLength(viewBoxLength: number) {
    this._viewBoxLength.set(viewBoxLength);
  }

  @Input() set viewBoxHeight(viewBoxHeight: number) {
    this._viewBoxHeight.set(viewBoxHeight);
  }

  @Input() set zeroFrameCompensation(zeroFrameCompensation: number) {
    this._zeroFrameCompensation.set(zeroFrameCompensation);
  }

  @Input() set lastFrame(lastFrame: number) {
    this._lastFrame.set(lastFrame);
  }

  @Input() set selectedDeck(selectedDeck: IncidentDecks) {
    this.incidentDetailDeckTopView.set(
      `assets/svg/DeckFourSeasons/Top_view_Deck_${selectedDeck?.number}.svg`
    );
    this._selectedDeck.set(selectedDeck || undefined);
  }

  checkIfCurrentMVZHasIncidents(
    mvzToCheck: string,
    assetToDraw?: IncidentDetailAsset
  ): boolean {
    return assetToDraw?.mvz === mvzToCheck;
  }

  getMVZColor(mvzToCheck: string, assetToDraw?: IncidentDetailAsset): string {
    const noIncidentInMVZTextColor = "rgba(255, 255, 255, 0.60)";
    const highlightedTextColor = "#ffffff";

    return assetToDraw?.mvz === mvzToCheck
      ? highlightedTextColor
      : noIncidentInMVZTextColor;
  }

  convertFrameInXPosition(assetToDraw: IncidentDetailAsset, isAlertIcon?: boolean): number {
    let convertedIncidentXPosition: number | undefined = undefined;

    convertedIncidentXPosition = Math.ceil(
      (this._viewBoxLength() *
        (Number(assetToDraw?.frame) + this._zeroFrameCompensation())) /
        (this._lastFrame() + this._zeroFrameCompensation())
    );

    if (isAlertIcon && convertedIncidentXPosition) {
      convertedIncidentXPosition -= 8;
    }

    return convertedIncidentXPosition;
  }

  getAssetYPosition(assetToDraw: IncidentDetailAsset, isAlertIcon?: boolean): number {
    let assetYPos = 0;

    switch (assetToDraw?.position) {
      case "SB":
        assetYPos = 112.5;
        break;

      case "PS":
        assetYPos = 217.5;
        break;

      case "CL":
        assetYPos = 165;
        break;
    }

    if (isAlertIcon) {
      assetYPos -= 10;
    }

    return assetYPos;
  }

  alertIndicatorColor = computed(() => {
    let fillColor = "";
    if (this.incidentDetailSelectedSeverity()) {
      switch (this.incidentDetailSelectedSeverity().toLowerCase()) {
        case "medium":
          fillColor = "#FF8826"; // arancione
          break;
        case "low":
          fillColor = "#FFCF26"; // giallo
          break;
        case "high":
          fillColor = "#F64D4D"; // rosso
          break;
        case "critical":
          fillColor = "#F64D4D"; // rosso
          break;
      }
    } else {
      fillColor = "#F64D4D";
    }

    return fillColor;
  });

  iconImagePath = computed(() => {
    let imagePath = "";
    if (this.incidentDetailSelectedSeverity()) {
      switch (this.incidentDetailSelectedSeverity().toLowerCase()) {
        case "medium":
          imagePath = "assets/svg/Alert icon.svg";
          break;
        case "low":
          imagePath = "assets/svg/Alert icon.svg";
          break;
        case "high":
          imagePath = "assets/svg/Alert icon.svg";
          break;
        case "critical":
          imagePath = "assets/svg/Alert icon.svg";
          break;
      }
    } else {
      imagePath = "assets/svg/Alert icon.svg";
    }

    return imagePath;
  });
}
