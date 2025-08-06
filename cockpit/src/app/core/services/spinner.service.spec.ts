import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have loading set to false', () => {
    service.getLoading().subscribe((value) => {
      expect(value).toBeFalse();
    });
  });
  it('should set loading to true when a URL is added', () => {
    service.addUrls('/api/test');

    service.getLoading().subscribe((value) => {
      expect(value).toBeTrue();
    });
  });

  it('should set loading to false when all URLs are removed', () => {
    service.addUrls('/api/one');
    service.removeUrls('/api/one');

    service.getLoading().subscribe((value) => {
      expect(value).toBeFalse();
    });
  });

  it('should emit loading manually with setLoading()', () => {
    service.setLoading(true);

    expect(service.getLoading().getValue()).toBeTrue();

    service.setLoading(false);

    expect(service.getLoading().getValue()).toBeFalse();
  });
});
