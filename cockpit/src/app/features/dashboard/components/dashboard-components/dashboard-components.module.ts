import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentOverviewTableComponent } from './incident-overview-table/incident-overview-table.component';
import { VesselPerformanceComponent } from './vessel-performance/vessel-performance.component';
import { AssetsStatementComponent } from './assets-statement/assets-statement.component';
import { ShipIncidentMapComponent } from './ship-incident-map/ship-incident-map.component';
import { ShipStateComponent } from '../ship-state/ship-state.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IncidentOverviewTableComponent,
    VesselPerformanceComponent,
    AssetsStatementComponent,
    ShipIncidentMapComponent,
    ShipStateComponent
  ],
  exports: [
    IncidentOverviewTableComponent,
    VesselPerformanceComponent,
    AssetsStatementComponent,
    ShipIncidentMapComponent,
    ShipStateComponent 
  ],
})
export class DashboardComponentsModule {}
