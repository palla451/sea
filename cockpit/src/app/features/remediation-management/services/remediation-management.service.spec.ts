import { TestBed } from '@angular/core/testing';

import { RemediationManagementService } from './remediation-management.service';

describe('RemediationManagementService', () => {
  let service: RemediationManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemediationManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
