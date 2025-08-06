import { TestBed } from '@angular/core/testing';

import { IncidentManagementModalService } from './incident-management-modal.service';

describe('IncidentManagementModalService', () => {
  let service: IncidentManagementModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentManagementModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
