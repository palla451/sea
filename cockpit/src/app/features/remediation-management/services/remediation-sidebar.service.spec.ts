import { TestBed } from '@angular/core/testing';

import { RemediationSidebarService } from './remediation-sidebar.service';

describe('RemediationSidebarService', () => {
  let service: RemediationSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemediationSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
