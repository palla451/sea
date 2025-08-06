import { TestBed } from '@angular/core/testing';

import { IncidentDetailManagerService } from './incident-detail-manager.service';

describe('IncidentDetailManagerService', () => {
  let service: IncidentDetailManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentDetailManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
