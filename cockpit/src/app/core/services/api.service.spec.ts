import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', () => {
    const dummyResponse = { data: 'ok' };
    const params = new HttpParams().set('q', 'test');

    service
      .get('endpoint', params, { Authorization: 'Bearer abc' })
      .subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

    const req = httpMock.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === `${baseUrl}/endpoint` &&
        req.params.get('q') === 'test'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush(dummyResponse);
  });

  it('should perform POST request', () => {
    const dummyResponse = { success: true };
    const body = { name: 'Test' };

    service
      .post('endpoint', body, { Authorization: 'Bearer token' })
      .subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

    const req = httpMock.expectOne(`${baseUrl}/endpoint`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(dummyResponse);
  });

  it('should perform PUT request', () => {
    const dummyResponse = { updated: true };
    const body = { id: 1, name: 'Updated' };

    service.put('endpoint', body).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/endpoint`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(dummyResponse);
  });
  it('should perform PATCH request', () => {
    const dummyResponse = { patched: true };
    const body = { status: 'active' };

    service.patch('endpoint', body).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/endpoint`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(dummyResponse);
  });

  it('should perform DELETE request', () => {
    const dummyResponse = { deleted: true };

    service
      .delete('endpoint', { Authorization: 'Bearer xyz' })
      .subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

    const req = httpMock.expectOne(`${baseUrl}/endpoint`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer xyz');
    req.flush(dummyResponse);
  });
});
