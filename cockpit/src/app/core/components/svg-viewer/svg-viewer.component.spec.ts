import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SvgViewerComponent } from "./svg-viewer.component";
import { IncidentDetailManagerService } from "../../../features/incident-detail/services/incident-detail-manager.service";
import { IncidentDecks } from "../../state";
import { IncidentDetailAsset } from "../../../features/incident-detail/models/incident-detail.models";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, of } from "rxjs";

describe("SvgViewerComponent", () => {
  let component: SvgViewerComponent;
  let fixture: ComponentFixture<SvgViewerComponent>;
  let incidentDetailManagerService: IncidentDetailManagerService;

  const mockIncidentDetailManagerService = {
    assetsByCurrentlySelectedDeck: of([]),
    incidentDetailSelectedSeverity: of(""),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, SvgViewerComponent],
      providers: [
        {
          provide: IncidentDetailManagerService,
          useValue: mockIncidentDetailManagerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgViewerComponent);
    component = fixture.componentInstance;
    incidentDetailManagerService = TestBed.inject(IncidentDetailManagerService);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("Deck selection", () => {
    it("should update deck top view correctly when selectedDeck changes", () => {
      const mockDeck: IncidentDecks = { number: "5" } as IncidentDecks;
      component.selectedDeck = mockDeck;
      expect(component.incidentDetailDeckTopView()).toBe(
        "assets/svg/DeckFourSeasons/Top_view_Deck_5.svg"
      );
    });
  });

  describe("Check incident existence in MVZ", () => {
    it("should return true if assetToDraw has the same MVZ", () => {
      const asset: IncidentDetailAsset = { mvz: "A1" } as IncidentDetailAsset;
      expect(component.checkIfCurrentMVZHasIncidents("A1", asset)).toBeTrue();
    });

    it("should return false if assetToDraw has a different MVZ", () => {
      const asset: IncidentDetailAsset = { mvz: "A1" } as IncidentDetailAsset;
      expect(component.checkIfCurrentMVZHasIncidents("B2", asset)).toBeFalse();
    });
  });

  describe("Get MVZ text color", () => {
    it("should return highlighted color if MVZ has an incident", () => {
      const asset: IncidentDetailAsset = { mvz: "A1" } as IncidentDetailAsset;
      expect(component.getMVZColor("A1", asset)).toBe("#ffffff");
    });

    it("should return default color if MVZ does not have an incident", () => {
      const asset: IncidentDetailAsset = { mvz: "A1" } as IncidentDetailAsset;
      expect(component.getMVZColor("B2", asset)).toBe(
        "rgba(255, 255, 255, 0.60)"
      );
    });
  });

  describe("Convert frame to X position", () => {
    beforeEach(() => {
      component.viewBoxLength = 1200;
      component.zeroFrameCompensation = 10;
      component.lastFrame = 100;
    });

    it("should correctly calculate X position", () => {
      const asset: IncidentDetailAsset = { frame: "50" } as IncidentDetailAsset;
      expect(component.convertFrameInXPosition(asset)).toBeGreaterThan(0);
    });

    it("should adjust X position if isAlertIcon is true", () => {
      const asset: IncidentDetailAsset = { frame: "50" } as IncidentDetailAsset;
      const xPosWithoutAlert = component.convertFrameInXPosition(asset, false);
      const xPosWithAlert = component.convertFrameInXPosition(asset, true);
      expect(xPosWithAlert).toBeLessThan(xPosWithoutAlert);
    });
  });

  describe("Get asset Y position", () => {
    it("should return correct Y position for SB", () => {
      const asset: IncidentDetailAsset = {
        position: "SB",
      } as IncidentDetailAsset;
      expect(component.getAssetYPosition(asset)).toBe(112.5);
    });

    it("should return correct Y position for PS", () => {
      const asset: IncidentDetailAsset = {
        position: "PS",
      } as IncidentDetailAsset;
      expect(component.getAssetYPosition(asset)).toBe(217.5);
    });

    it("should return correct Y position for CL", () => {
      const asset: IncidentDetailAsset = {
        position: "CL",
      } as IncidentDetailAsset;
      expect(component.getAssetYPosition(asset)).toBe(165);
    });

    it("should adjust Y position when isAlertIcon is true", () => {
      const asset: IncidentDetailAsset = {
        position: "SB",
      } as IncidentDetailAsset;
      expect(component.getAssetYPosition(asset, true)).toBe(102.5);
    });
  });

  describe("Alert indicator color", () => {
    it("should return default color if severity is undefined", () => {
      mockIncidentDetailManagerService.incidentDetailSelectedSeverity = of("");
      fixture.detectChanges();
      expect(component.alertIndicatorColor()).toBe("#F64D4D");
    });
  });

  describe("Icon image path", () => {
    it("should return correct image path for each severity level", () => {
      const severities = ["low", "medium", "high", "critical"];
      severities?.forEach((severity) => {
        mockIncidentDetailManagerService.incidentDetailSelectedSeverity =
          of(severity);
        fixture.detectChanges();
        expect(component.iconImagePath()).toBe("assets/svg/Alert icon.svg");
      });
    });

    it("should return default icon path if severity is undefined", () => {
      mockIncidentDetailManagerService.incidentDetailSelectedSeverity = of("");
      fixture.detectChanges();
      expect(component.iconImagePath()).toBe("assets/svg/Alert icon.svg");
    });
  });
});
