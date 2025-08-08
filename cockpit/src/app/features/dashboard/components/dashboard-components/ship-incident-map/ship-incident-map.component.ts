import { CommonModule } from "@angular/common";
import { Component, inject, computed, OnInit, signal } from "@angular/core";
import { HoverService } from "../../../services/hover.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, noop, tap } from "rxjs";
import { isNonNull } from "../../../../../core/utils/rxjs-operators/noNullOperator";
import { GridElement, Incident } from "../../../models/dashboard.models";
import { IncidentManagementManagerService } from "../../../../../core/services/incident-management-manager.service";

@Component({
  selector: "app-ship-incident-map",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ship-incident-map.component.html",
  styleUrls: ["./ship-incident-map.component.scss"],
})
export class ShipIncidentMapComponent implements OnInit {
  private hoverService = inject(HoverService);
  private incidentManagementManagerService = inject(IncidentManagementManagerService);

  highlightedIncident = toSignal(
    this.hoverService.hoveredRow$.pipe(filter(isNonNull))
  );

  // currentTablePageImpactedDecks = toSignal(
  //   this.incidentManagementManagerService.overviewIncidentTableCurrPageImpactedDecks.pipe(filter(isNonNull))
  // );
  currentTablePageImpactedDecks = signal<number[]>([]);

  highlightedIncidentSeverity = computed<string>(() => {
    return this.highlightedIncident()?.severity?.toLowerCase() || "";
  });

  highlightedIncidentDecks = toSignal(
    this.hoverService.hoveredRow$.pipe(
      filter(isNonNull),
      map((hoveredRow) => hoveredRow?.decks)
    )
  );

  gridLines: GridElement[] = [
    // Righe orizzontali
    {
      x1: 18,
      y1: 66,
      x2: 1200,
      y2: 66,
      orientation: "horizontal",
      lineLabel: "15",
      sectorTickness: 20,
    },
    {
      x1: 18,
      y1: 84,
      x2: 1200,
      y2: 84,
      orientation: "horizontal",
      lineLabel: "14",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 101,
      x2: 1200,
      y2: 101,
      orientation: "horizontal",
      lineLabel: "13",
      sectorTickness: 17,
    },
    {
      x1: 18,
      y1: 119,
      x2: 1200,
      y2: 119,
      orientation: "horizontal",
      lineLabel: "12",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 137,
      x2: 1200,
      y2: 137,
      orientation: "horizontal",
      lineLabel: "11",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 154,
      x2: 1200,
      y2: 154,
      orientation: "horizontal",
      lineLabel: "10",
      sectorTickness: 17,
    },
    {
      x1: 18,
      y1: 172,
      x2: 1200,
      y2: 172,
      orientation: "horizontal",
      lineLabel: "09",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 189,
      x2: 1200,
      y2: 189,
      orientation: "horizontal",
      lineLabel: "08",
      sectorTickness: 17,
    },
    {
      x1: 18,
      y1: 207,
      x2: 1200,
      y2: 207,
      orientation: "horizontal",
      lineLabel: "07",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 225,
      x2: 1200,
      y2: 225,
      orientation: "horizontal",
      lineLabel: "06",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 243,
      x2: 1200,
      y2: 243,
      orientation: "horizontal",
      lineLabel: "05",
      sectorTickness: 18,
    },
    {
      x1: 18,
      y1: 260,
      x2: 1200,
      y2: 260,
      orientation: "horizontal",
      lineLabel: "04",
      sectorTickness: 17,
    },
    {
      x1: 18,
      y1: 277,
      x2: 1200,
      y2: 277,
      orientation: "horizontal",
      lineLabel: "03",
      sectorTickness: 17,
    },
    {
      x1: 18,
      y1: 296,
      x2: 1200,
      y2: 296,
      orientation: "horizontal",
      lineLabel: "02",
      sectorTickness: 19,
    },
    {
      x1: 18,
      y1: 320,
      x2: 1200,
      y2: 320,
      orientation: "horizontal",
      lineLabel: "01",
      sectorTickness: 24,
    },
    { x1: 18, y1: 339, x2: 1200, y2: 339, orientation: "horizontal" },

    // Righe verticali
    { x1: 259, y1: 28, x2: 259, y2: 359, orientation: "vertical" },
    { x1: 488, y1: 28, x2: 488, y2: 359, orientation: "vertical" },
    { x1: 697, y1: 28, x2: 697, y2: 359, orientation: "vertical" },
    { x1: 948, y1: 28, x2: 948, y2: 359, orientation: "vertical" },
  ];

  ngOnInit(): void {
    this.incidentManagementManagerService.overviewIncidentTableCurrPageImpactedDecks.pipe(
      filter(isNonNull),
      tap(impactedDecks => {
        this.currentTablePageImpactedDecks.set(impactedDecks);
      })
  ).subscribe(noop);
  }

  checkIfDeckHasIncidents(deckLabel: string | undefined): boolean {
    let checkResult = false;
    if (deckLabel) {
      const cleanedDeckValue =
        deckLabel[0] == "0" ? Number(deckLabel[1]) : Number(deckLabel);
      if (
        this.highlightedIncidentDecks()?.some(
          (deck) => deck == cleanedDeckValue
        )
      ) {
        checkResult = true;
      }
    }

    return checkResult;
  }

  private checkIfAreHighlightedIncidentDecks(): boolean {
    return !!this.highlightedIncidentDecks()?.length
  }

  checkIfAlertIconIsActive(deckLabel: string | undefined): boolean {
    let checkResult = false;
    if (deckLabel) {
      const cleanedDeckValue =
        deckLabel[0] == "0" ? Number(deckLabel[1]) : Number(deckLabel);

        switch (this.checkIfAreHighlightedIncidentDecks()) {
          case true:
            checkResult = this.checkIfDeckHasIncidents(deckLabel);
            break;
        
          case false:
            checkResult = this.currentTablePageImpactedDecks()?.some(
              (deck) => deck == cleanedDeckValue
            )
            break;
        }

    }

    return checkResult;
  }

  convertFrameInXPosition(
    currentIncident: Incident | undefined,
    deckLabel: string | undefined,
    isAlertIcon?: boolean
  ): number | undefined {
    //TODO - I DATI DI LUNGHEZZA TOTALE E LUNGHEZZA FRAME ATTUALMENTE
    // USATI IN QUESTA FUNZIONE SARANNO SUCCESSIVAMENTE DA CONFERMARE
    // ED AGGANCIARE AD UNA APPOSITA API DI BE
    // AGGIUNGERE PER MAGGIORE PRECISIONE ANCHE LA COMPENSAZIONE IN X SULLA ZERO POSITION DELLA PRUA

    let convertedIncidentXPosition: number | undefined = undefined;

    const wholeShipLength = 184.8;
    const singleFrameLength = 0.75;

    let currentDeckIncidentFrame: number | undefined = undefined;

    if (deckLabel && currentIncident) {
      const currentIncidentDeckIndex = currentIncident?.decks.findIndex(
        (deck) => {
          const cleanedDeckValue =
            deckLabel[0] == "0" ? Number(deckLabel[1]) : Number(deckLabel);

          return deck === cleanedDeckValue;
        }
      );

      if (currentIncidentDeckIndex !== -1 && currentIncident) {
        currentDeckIncidentFrame =
          currentIncident?.frames[currentIncidentDeckIndex];
      }
    }

    if (currentDeckIncidentFrame) {
      convertedIncidentXPosition = Math.ceil(
        (1200 * currentDeckIncidentFrame) /
          (wholeShipLength / singleFrameLength)
      );
    }

    if (isAlertIcon && convertedIncidentXPosition) {
      convertedIncidentXPosition -= 8;
    }

    return convertedIncidentXPosition;
  }

  iconImagePath = computed(() => {
    let imagePath = "";
    if (this.highlightedIncident()?.severity) {
      switch (this.highlightedIncident()?.severity.toLowerCase()) {
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

  alertIndicatorColor = computed(() => {
    let fillColor = "";
    if (this.highlightedIncident()?.severity) {
      switch (this.highlightedIncident()?.severity.toLowerCase()) {
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

  getDeckLabelColor(lineLabel: string | undefined): string {
    return lineLabel && this.checkIfAlertIconIsActive(lineLabel)
      ? "#fff"
      : "rgba(255, 255, 255, 0.6)";
  }
}
