import { TestBed } from '@angular/core/testing';

import { RemediationOverviewService } from './remediation-overview.service';

describe('RemediationOverviewService', () => {
  let service: RemediationOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemediationOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
