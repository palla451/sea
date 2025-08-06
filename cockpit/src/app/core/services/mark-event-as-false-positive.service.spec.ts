import { TestBed } from '@angular/core/testing';

import { MarkEventAsFalsePositiveService } from './mark-event-as-false-positive.service';

describe('MarkEventAsFalsePositiveService', () => {
  let service: MarkEventAsFalsePositiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkEventAsFalsePositiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
