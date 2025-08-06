import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionItem } from "../../models/tree-view.models";
import { RemediationTrendComponent } from "../remediation-trend/remediation-trend.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import {
  calculateOperatingPercentageFeature,
  getAllShipFunctsByAssetFeature,
} from "../../state";
import { CurrentStepAsset } from "../../models/remediation-impact.model";
@Component({
  selector: "app-tree-view-node",
  standalone: true,
  imports: [CommonModule, RemediationTrendComponent],
  templateUrl: "./tree-view-node.component.html",
  styleUrl: "./tree-view-node.component.scss",
})
export class TreeViewNodeComponent implements OnChanges {
  private store = inject(Store);

  private _isHostRemediationManagement = signal<boolean>(false);
  @Input() set isHostRemediationManagement(
    isHostRemediationManagement: boolean
  ) {
    this._isHostRemediationManagement.set(isHostRemediationManagement);
  }

  get isHostRemediationManagement() {
    return this._isHostRemediationManagement();
  }

  @Input() set data(data: AccordionItem) {
    this._data.set(data);
  }
  @Input() initiallyExpanded = false; // Nuovo input
  isExpanded = false;
  private _data = signal<AccordionItem | null>(null);

  /**
   * retrieve ship functions for asset involved signal
   */
  shipFunctionsForAssetInvolved = toSignal(
    this.store.select(
      getAllShipFunctsByAssetFeature.selectShipFunctionsByAsset
    ),
    {
      initialValue: [],
    }
  );

  /**
   * calculate operating percentage signal
   */
  calculateOperatingPercentageSignal = toSignal(
    this.store.select(
      calculateOperatingPercentageFeature.selectCurrentStepAsset
    ),
    {
      initialValue: null,
    }
  );

  getNodeFinalOperatingPercentage(): number {
    let returningVal: number = 0;
    returningVal = this.isHostRemediationManagement
      ? this.calculateFunctionRiskEnginePercentage()
      : (this.data.percentage as number);
    return returningVal;
  }

  ngOnChanges() {
    // Se l'input cambia, mantieni lo stato di espansione
    if (this.initiallyExpanded) {
      this.isExpanded = true;
    }
  }

  get data() {
    return this._data() as AccordionItem;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  constructor() {
    effect(() => {
      this.calculateFunctionRiskEnginePercentage();
      this.retrieveShipFuncForAssetInvolvedPercentage();
    });
  }

  retrieveShipFuncForAssetInvolvedPercentage(): number {
    let calculatedVal: number = 0;

    const drawedFunctioneNode = this.shipFunctionsForAssetInvolved()?.find(
      (func) => func.function === this.data.title
    );
    if (drawedFunctioneNode) {
      calculatedVal = Number(drawedFunctioneNode.percentage);
    }

    return calculatedVal;
  }

  calculateFunctionRiskEnginePercentage(): number {
    let calculatedVal: number = 0;

    if (this.calculateOperatingPercentageSignal()) {
      const drawedFunctioneNode = (
        this.calculateOperatingPercentageSignal() as CurrentStepAsset[]
      )[0]?.functions?.find((func) => func.id === Number(this.data.id));
      if (drawedFunctioneNode) {
        calculatedVal = drawedFunctioneNode.operatingPercentage;
      }
    }

    return calculatedVal;
  }

  calculateRemediationPercentage(): number {
    return (
      this.retrieveShipFuncForAssetInvolvedPercentage() -
      this.calculateFunctionRiskEnginePercentage()
    );
  }

  calculateWholeIntegrity(items: AccordionItem[]): number | undefined {
    if (!items || items.length === 0) return 100;

    const validChildren = items.filter(
      (child) => typeof child?.percentage === "number"
    );

    if (validChildren.length === 0) return 100;

    const sum = validChildren.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem?.percentage || 0);
    }, 0);

    const average = sum / validChildren.length;
    return Math.round(average);
  }

  trackByFn(item: AccordionItem): string {
    return item?.id ?? "";
  }

  getDataId(data: AccordionItem): boolean {
    return data && data?.id ? data?.id === "no-results" : false;
  }
}
