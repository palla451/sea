import { Component, Input, signal } from "@angular/core";

@Component({
  selector: "app-remediation-trend",
  imports: [],
  templateUrl: "./remediation-trend.component.html",
  styleUrl: "./remediation-trend.component.scss",
})
export class RemediationTrendComponent {
  private _trendPercentage = signal<number>(0);

  @Input() set trendPercentage(trendPercentage: number) {
    this._trendPercentage.set(trendPercentage);
  }

  get trendPercentage() {
    return this._trendPercentage();
  }

  getNumberAbsValue(inputValue: number): number {
    return Math.abs(inputValue);
  }
}
