import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import { SharedModule } from "../../../../shared/shared.module";
import { SelectModule } from "primeng/select";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import {
  IncidentDecks,
  selectAssetsGroupedByDeck,
  selectCurrentIncidentSeverity,
  selectUniqueDecks,
} from "../../../../core/state";
import { IncidentDetailAsset } from "../../models/incident-detail.models";
import { SvgViewerComponent } from "../../../../core/components/svg-viewer/svg-viewer.component";
import { IncidentDetailManagerService } from "../../services/incident-detail-manager.service";

@Component({
  selector: "app-incident-detail-deck-accordion",
  imports: [AccordionModule, SharedModule, SelectModule, SvgViewerComponent],
  templateUrl: "./incident-detail-deck-accordion.component.html",
  styleUrl: "./incident-detail-deck-accordion.component.scss",
})
export class IncidentDetailDeckAccordionComponent implements OnInit, OnDestroy {
  @Output() toggle = new EventEmitter<boolean>();
  decks: IncidentDecks[] | undefined;

  isAccordionOpen = true;
  private readonly store = inject(Store);
  private incidentDetailManagerService = inject(IncidentDetailManagerService);

  currentIncidentSeverity = toSignal(
    this.store.select(selectCurrentIncidentSeverity),
    {
      initialValue: "",
    }
  );

  assetsGroupedByDeck = toSignal(this.store.select(selectAssetsGroupedByDeck), {
    initialValue: [],
  });

  uniqueIncidentDecks = toSignal(this.store.select(selectUniqueDecks), {
    initialValue: [],
  });

  selectedDeck: IncidentDecks = this.uniqueIncidentDecks()[0];
  selectedDeckSignal = signal(this.selectedDeck);

  assetsByCurrentlySelectedDeck = computed<IncidentDetailAsset[]>(() => {
    return this.assetsGroupedByDeck().filter(
      (assetsGroup) => assetsGroup.deck === this.uniqueIncidentDecks()[0]?.number
    )[0]?.assets;
  });

  // Effetto per sincronizzare ngModel di selectedDeck con signal assetsByCurrentlySelectedDeck
  constructor() {
    this.selectedDeckSignal.set(this.uniqueIncidentDecks()[0]);

    effect(() => {
      this.incidentDetailManagerService.updateAssetsByCurrentlySelectedDeck(
        this.assetsByCurrentlySelectedDeck()
      );

      this.incidentDetailManagerService.updateIncidentDetailSelectedSeverity(
        this.currentIncidentSeverity()
      );

      this.selectedDeck = this.uniqueIncidentDecks()[0];
    });
  }

  ngOnInit(): void {
    this.incidentDetailManagerService.updateIncidentAccordionOpened(this.isAccordionOpen);
  }

  ngOnDestroy(): void {
    this.incidentDetailManagerService.resetSelectedIncidentDetailDeck();
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
    this.incidentDetailManagerService.updateIncidentAccordionOpened(this.isAccordionOpen);
    this.toggle.emit(this.isAccordionOpen);
  }

  onDeckSelect(deckSelected: any) {
    this.selectedDeckSignal.set(this.selectedDeck);
    this.incidentDetailManagerService.updateSelectedIncidentDetailDeck(
      deckSelected?.value as IncidentDecks
    );
  }
}
