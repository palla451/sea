import { TestBed } from '@angular/core/testing';

import { CyberResilienceSidebarService } from './cyber-resilience-sidebar.service';

describe('CyberResilienceSidebarService', () => {
  let service: CyberResilienceSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberResilienceSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
