import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  HostListener,
  ElementRef,
  signal,
  inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { SidebarService } from "../../../features/dashboard/services/dashboard-sidebar.service";
import { Store } from "@ngrx/store";
import { incidentDetailActions } from "../../state/actions";
import { NavigationTargetEnum } from "../../enums/navigation-targets.enum";

@Component({
  selector: "app-custom-context-menu",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./custom-context-menu.component.html",
  styleUrl: "./custom-context-menu.component.scss",
})
export class CustomContextMenuComponent {
  private _isContextualMenuVisible = signal<boolean>(false);
  private _isContextualMenuId = signal<string>("");
  private readonly store = inject(Store);
  dashboardSidebarService = inject(SidebarService);
  router = inject(Router);

  @Output() rollBackAction = new EventEmitter<string>();

  @Input() set isContextualMenuVisible(isContextualMenuVisible: boolean) {
    this._isContextualMenuVisible.set(isContextualMenuVisible || false);
  }

  get isContextualMenuVisible() {
    return this._isContextualMenuVisible();
  }

  @Input() set incidentId(incidentid: string) {
    this._isContextualMenuId.set(incidentid);
  }

  get contextualMenuId() {
    return this._isContextualMenuId();
  }

  @Input() actions: string[] = [];

  constructor(private el: ElementRef) {}

  @HostListener("document:click", ["$event.target"])
  onClickOutside(target: HTMLElement): void {
    const clickedInside = this.el.nativeElement.contains(target);
    if (!clickedInside) {
      this._isContextualMenuVisible.set(false);
    }
  }

  manageTooltipAction(action: string): void {
    if (action === "Incident detail") {
      this.store.dispatch(
        incidentDetailActions.getAllIncidentDetail({
          incidentId: this.contextualMenuId,
        })
      );
      this.dashboardSidebarService.updateIncidentDetailInitiator(
        NavigationTargetEnum.remediations
      );
      this.router.navigate(["/incident-detail", this.contextualMenuId]);
    }

    if (action === "Roll back") {
      this.rollBackAction.emit(this.contextualMenuId);
    }
  }
}
