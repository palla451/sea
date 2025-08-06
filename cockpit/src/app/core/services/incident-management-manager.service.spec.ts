import { TestBed } from '@angular/core/testing';

import { IncidentManagementManagerService } from './incident-management-manager.service';

describe('IncidentManagementManagerService', () => {
  let service: IncidentManagementManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentManagementManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
