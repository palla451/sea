import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { HistoryTableComponent } from "../components/history-table/history-table.component";

@NgModule({
  declarations: [],
  imports: [SharedModule, HistoryTableComponent],
  exports: [SharedModule, HistoryTableComponent],
})
export class HistoryComponentsModule {}
