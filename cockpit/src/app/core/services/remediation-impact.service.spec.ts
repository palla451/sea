import { TestBed } from '@angular/core/testing';

import { RemediationImpactService } from './remediation-impact.service';

describe('RemediationImpactService', () => {
  let service: RemediationImpactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemediationImpactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
