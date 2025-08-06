import { TestBed } from '@angular/core/testing';

import { CyberResilienceOVManagerService } from './cyber-resilience-ovmanager.service';

describe('CyberResilienceOVManagerService', () => {
  let service: CyberResilienceOVManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberResilienceOVManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
