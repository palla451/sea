import { NgModule } from '@angular/core';
import { AssetsInvolvedComponent } from '../../../core/components/assets-involved/assets-involved.component';
import { IncidentTimelineComponent } from '../../../core/components/incident-timeline/incident-timeline.component';
import { RemediationOverviewComponent } from '../../../core/components/remediation-overview/remediation-overview.component';
import { SharedModule } from '../../../shared/shared.module';
import { IncidentDetailHeaderComponent } from './incident-detail-header/incident-detail-header.component';
import { IncidentDetailDeckAccordionComponent } from './incident-detail-deck-accordion/incident-detail-deck-accordion.component';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    AssetsInvolvedComponent,
    IncidentTimelineComponent,
    RemediationOverviewComponent,
    IncidentDetailHeaderComponent,
    IncidentDetailDeckAccordionComponent,
  ],
  exports: [
    SharedModule,
    AssetsInvolvedComponent,
    IncidentTimelineComponent,
    RemediationOverviewComponent,
    IncidentDetailHeaderComponent,
    IncidentDetailDeckAccordionComponent,
  ],
})
export class IncidentDetailComponentsModule {}
