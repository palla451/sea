import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CyberResilienceParametersComponent } from "./cyber-resilience-parameters.component";
import { CyberResilienceOVManagerService } from "../../../features/dashboard/services/cyber-resilience-ovmanager.service";
import { BehaviorSubject } from "rxjs";

describe("CyberResilienceParametersComponent", () => {
  let component: CyberResilienceParametersComponent;
  let fixture: ComponentFixture<CyberResilienceParametersComponent>;
  let cyberResilienceOVManagerService: CyberResilienceOVManagerService;

  // Creiamo un BehaviorSubject per simulare l'Observable
  const mockCyberResiliencePerformance$ = new BehaviorSubject<{
    operatingPercentage: number;
  } | null>(null);

  const mockCyberResilienceOVManagerService = {
    selectedCyberResiliencePerformance$:
      mockCyberResiliencePerformance$.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyberResilienceParametersComponent],
      providers: [
        {
          provide: CyberResilienceOVManagerService,
          useValue: mockCyberResilienceOVManagerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CyberResilienceParametersComponent);
    component = fixture.componentInstance;
    cyberResilienceOVManagerService = TestBed.inject(
      CyberResilienceOVManagerService
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test per cyberResilienceFunctionalityPercent
  describe("cyberResilienceFunctionalityPercent", () => {
    it("should return the correct percentage when data is available", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 65 }); // Simuliamo un valore
      fixture.detectChanges();

      expect(component.cyberResilienceFunctionalityPercent()).toBe(65);
    });

    it("should return 0 when data is null", () => {
      mockCyberResiliencePerformance$.next(null); // Simuliamo un valore nullo
      fixture.detectChanges();

      expect(component.cyberResilienceFunctionalityPercent()).toBe(0);
    });
  });

  // Test per calculateArrowPosition
  describe("calculateArrowPosition", () => {
    it("should return the percentage for arrow position", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 50 });
      fixture.detectChanges();

      expect(component.calculateArrowPosition()).toBe(50);
    });
  });

  // Test per getProgressBarClass
  describe("getProgressBarClass", () => {
    it("should return 'progress-red' for values < 40", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 20 });
      fixture.detectChanges();

      expect(component.getProgressBarClass()).toBe("progress-red");
    });

    it("should return 'progress-yellow' for values between 40 and 75", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 50 });
      fixture.detectChanges();

      expect(component.getProgressBarClass()).toBe("progress-yellow");
    });

    it("should return 'progress-green' for values >= 75", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 80 });
      fixture.detectChanges();

      expect(component.getProgressBarClass()).toBe("progress-green");
    });
  });

  // Test per getArrowClass
  describe("getArrowClass", () => {
    it("should return 'arrow-red' for values < 40", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 30 });
      fixture.detectChanges();

      expect(component.getArrowClass()).toBe("arrow-red");
    });

    it("should return 'arrow-yellow' for values between 40 and 75", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 55 });
      fixture.detectChanges();

      expect(component.getArrowClass()).toBe("arrow-yellow");
    });

    it("should return 'arrow-green' for values >= 75", () => {
      mockCyberResiliencePerformance$.next({ operatingPercentage: 80 });
      fixture.detectChanges();

      expect(component.getArrowClass()).toBe("arrow-green");
    });
  });
});
