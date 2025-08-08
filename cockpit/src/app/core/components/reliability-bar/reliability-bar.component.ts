import { Component, Input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RemediationTrendComponent } from "../remediation-trend/remediation-trend.component";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: "app-reliability-bar",
  standalone: true,
  imports: [FormsModule, CommonModule, RemediationTrendComponent, SharedModule],
  templateUrl: "./reliability-bar.component.html",
  styleUrl: "./reliability-bar.component.scss",
})
export class ReliabilityBarComponent {
  private _reliabilityBarTitle = signal<string>("");
  private _macrofuncTrendPercentage = signal<number>(0);
  private _macrofuncOVPercentage = signal<number>(0);
  private _finalPercentage = signal<number>(0);

  @Input() set reliabilityBarTitle(reliabilityBarTitle: string) {
    this._reliabilityBarTitle.set(reliabilityBarTitle);
  }

  @Input() set finalPercentage(finalPercentage: number) {
    this._finalPercentage.set(finalPercentage);
  }

  @Input() set macrofuncTrendPercentage(macrofuncTrendPercentage: number) {
    this._macrofuncTrendPercentage.set(macrofuncTrendPercentage);
  }

  @Input() set macrofuncOVPercentage(macrofuncOVPercentage: number) {
    this._macrofuncOVPercentage.set(macrofuncOVPercentage);
  }

  get reliabilityBarTitle() {
    return this._reliabilityBarTitle();
  }

  get finalPercentage() {
    return this._finalPercentage();
  }

  get macrofuncTrenPercentage() {
    return this._macrofuncTrendPercentage();
  }

  get macrofuncOVPercentage() {
    return this._macrofuncOVPercentage();
  }

  getPercentageWidthByFinalPercentage(finalPercentage: number): any {
    return {
      width: finalPercentage ? `${finalPercentage}%` : `0%`,
    };
  }

  getPercentageLeftPosByFinalPercentage(finalPercentage: number): any {
    return {
      left: finalPercentage ? `${finalPercentage}%` : `0%`,
    };
  }

  getPercentageLeftPosByForseenPercentage(
    finalPercentage1: number,
    finalPercentage2: number
  ): any {
    return {
      left: `${finalPercentage1 - finalPercentage2}%`,
    };
  }

  getTrendPercentageBarStyle(
    finalPercentage: number,
    macrofuncTrenPercentage: number
  ): any {
    return {
      // width: finalPercentage ? `${Math.abs(macrofuncTrenPercentage)}%` : `0%`,
      width: `${Math.abs(macrofuncTrenPercentage)}%`,
      left: finalPercentage ? `${finalPercentage}%` : `0%`,
      background: this.getProgressBarColor(),
    };
  }

  getProgressBarClass(): string {
    if (this.macrofuncOVPercentage >= 0 && this.macrofuncOVPercentage < 40) {
      return "progress-red";
    } else if (
      this.macrofuncOVPercentage >= 40 &&
      this.macrofuncOVPercentage < 75
    ) {
      return "progress-yellow";
    } else {
      return "progress-green";
    }
  }

  getProgressBarColor(): string {
    if (this.macrofuncOVPercentage >= 0 && this.macrofuncOVPercentage < 40) {
      return "#ff3d32";
    } else if (
      this.macrofuncOVPercentage >= 40 &&
      this.macrofuncOVPercentage < 75
    ) {
      return "#ffb300";
    } else {
      return "#4caf50";
    }
  }

  getArrowClass(): string {
    if (this.macrofuncOVPercentage >= 0 && this.macrofuncOVPercentage < 40) {
      return "arrow-red";
    } else if (
      this.macrofuncOVPercentage >= 40 &&
      this.macrofuncOVPercentage < 75
    ) {
      return "arrow-yellow";
    } else {
      return "arrow-green";
    }
  }

  getPercentagePosition(operatingPercentage: any): string {
    const numberOpPercentage = Number(operatingPercentage);

    if (numberOpPercentage <= 20) {
      return "percentage-left-alligned";
    } else {
      return "percentage-right-alligned";
    }
  }

  getForseenPercentagePosition(
    macrofuncOVPercentage: any,
    macrofuncTrenPercentage: any
  ): string {
    const numberOpPercentage =
      Number(macrofuncOVPercentage) - Number(macrofuncTrenPercentage);

    if (numberOpPercentage <= 20) {
      return "percentage-left-alligned";
    } else {
      return "percentage-right-alligned";
    }
  }
}
