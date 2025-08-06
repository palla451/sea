import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainLayoutComponent } from "./core/layouts/main-layout/main-layout.component";
import { Store } from "@ngrx/store";
import { fromMessage } from "./core/state";
import { AlertComponent } from "./core/components/alert/alert.component";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./core/components/loader/loader.component";
import { SpinnerService } from "./core/services/spinner.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { PollingService } from "./core/services/polling.service";

@Component({
  selector: "app-root",
  imports: [
    RouterModule,
    MainLayoutComponent,
    AlertComponent,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly pollingService = inject(PollingService);

  spinnerService = inject(SpinnerService);
  showSpinner = toSignal(this.spinnerService.getLoading(), {
    initialValue: false,
  });

  messages = this.store.selectSignal(fromMessage.selectMessages);

  ngOnInit(): void {
    this.pollingService.setupPollingControl();
  }

  ngOnDestroy(): void {
    this.pollingService.stopPolling();
  }
}
