import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShipIncidentMapComponent } from "./ship-incident-map.component";
import { HoverService } from "../../../services/hover.service";
import { of } from "rxjs";
import { Incident } from "../../../models/dashboard.models";
import { signal } from "@angular/core";

describe("ShipIncidentMapComponent", () => {
  let component: ShipIncidentMapComponent;
  let fixture: ComponentFixture<ShipIncidentMapComponent>;
  let hoverService: HoverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipIncidentMapComponent],
      providers: [HoverService],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipIncidentMapComponent);
    component = fixture.componentInstance;
    hoverService = TestBed.inject(HoverService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test per checkIfDeckHasIncidents
  describe("checkIfDeckHasIncidents", () => {
    it("should return true if deck has incidents", () => {
      component.highlightedIncidentDecks = signal([1, 2, 3]);
      const result = component.checkIfDeckHasIncidents("2");
      expect(result).toBeTrue();
    });

    it("should return false if deck does not have incidents", () => {
      component.highlightedIncidentDecks = signal([1, 2, 3]);
      const result = component.checkIfDeckHasIncidents("5");
      expect(result).toBeFalse();
    });

    it("should return false if deckLabel is undefined", () => {
      component.highlightedIncidentDecks = signal([1, 2, 3]);
      const result = component.checkIfDeckHasIncidents(undefined);
      expect(result).toBeFalse();
    });
  });

  // Test per getDeckLabelColor
  describe("getDeckLabelColor", () => {
    it("should return the correct color when deck has incidents", () => {
      spyOn(component, "checkIfDeckHasIncidents").and.returnValue(true);
      const color = component.getDeckLabelColor("1");
      expect(color).toBe("#fff");
    });

    it("should return the default color when deck has no incidents", () => {
      spyOn(component, "checkIfDeckHasIncidents").and.returnValue(false);
      const color = component.getDeckLabelColor("1");
      expect(color).toBe("rgba(255, 255, 255, 0.6)");
    });

    it("should return default color when deckLabel is undefined", () => {
      const color = component.getDeckLabelColor(undefined);
      expect(color).toBe("rgba(255, 255, 255, 0.6)");
    });
  });

  // Test per highlightedIncidentSeverity
  describe("highlightedIncidentSeverity", () => {
    it("should return the correct severity level", () => {
      component.highlightedIncident = signal({ severity: "high" } as Incident);
      expect(component.highlightedIncidentSeverity()).toBe("high");
    });

    it("should return empty string if severity is undefined", () => {
      component.highlightedIncident = signal({} as Incident);
      expect(component.highlightedIncidentSeverity()).toBe("");
    });
  });

  // Test per convertFrameInXPosition
  describe("convertFrameInXPosition", () => {
    it("should return correct X position", () => {
      const incident: Incident = { frames: [100], decks: [5] } as any;
      const xPosition = component.convertFrameInXPosition(incident, "5");
      expect(xPosition).toBeGreaterThan(0);
    });

    it("should return undefined if incident or deckLabel is undefined", () => {
      const xPosition = component.convertFrameInXPosition(undefined, undefined);
      expect(xPosition).toBeUndefined();
    });

    it("should adjust position when isAlertIcon is true", () => {
      const incident: Incident = { frames: [100], decks: [5] } as any;
      const xPosition = component.convertFrameInXPosition(incident, "5", true);
      expect(xPosition).toBeDefined();
      expect(xPosition).toBeLessThan(
        component.convertFrameInXPosition(incident, "5", false)!
      );
    });
  });

  // Test per iconImagePath
  describe("iconImagePath", () => {
    it("should return correct image path for severity levels", () => {
      const severities = ["low", "medium", "high", "critical"];
      severities?.forEach((severity) => {
        component.highlightedIncident = signal({ severity } as Incident);
        expect(component.iconImagePath()).toBe("assets/svg/Alert icon.svg");
      });
    });

    it("should return default icon path when severity is undefined", () => {
      component.highlightedIncident = signal({} as Incident);
      expect(component.iconImagePath()).toBe("assets/svg/Alert icon.svg");
    });
  });
});
