import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  //private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  private getHeaders(customHeaders?: object): HttpHeaders {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    if (customHeaders) {
      Object.entries(customHeaders)?.forEach(([key, value]) => {
        headers = headers.set(key, String(value));
      });
    }

    return headers;
  }

  get<T>(
    endpoint: string,
    params?: HttpParams | undefined,
    headers?: object
  ): Observable<T> {
    // next line commented in order to use first jsonplaceholder sample

    const beUrl = environment.production
      ? `${this.baseUrl}/${endpoint}`
      : `${endpoint}`;
    return this.http.get<T>(beUrl, {
      // return this.http.get<T>(`${endpoint}`, {
      headers: this.getHeaders(headers),
      params: params ?? undefined,
    });
  }

  post<T>(
    endpoint: string,
    body: any,
    params?: HttpParams,
    headers?: object
  ): Observable<T> {
    const beUrl = environment.production
      ? `${this.baseUrl}/${endpoint}`
      : `${endpoint}`;
    return this.http.post<T>(beUrl, body, {
      headers: this.getHeaders(headers),
      params: params,
    });
  }

  // post<T>(
  //   endpoint: string,
  //   body: any,
  //   paramsOrHeaders?: HttpParams | object,
  //   maybeHeaders?: object
  // ): Observable<T> {
  //   const beUrl = environment.production
  //     ? `${this.baseUrl}/${endpoint}`
  //     : `${endpoint}`;

  //   let params: HttpParams | undefined;
  //   let headers: object | undefined;

  //   if (paramsOrHeaders instanceof HttpParams) {
  //     params = paramsOrHeaders;
  //     headers = maybeHeaders;
  //   } else {
  //     headers = paramsOrHeaders;
  //   }

  //   return this.http.post<T>(beUrl, body, {
  //     headers: this.getHeaders(headers),
  //     params: params,
  //   });
  // }

  put<T>(endpoint: string, body: any, headers?: object): Observable<T> {
    const beUrl = environment.production
      ? `${this.baseUrl}/${endpoint}`
      : `${endpoint}`;
    return this.http.put<T>(beUrl, body, {
      headers: this.getHeaders(headers),
    });
  }

  patch<T>(endpoint: string, body: any, headers?: object): Observable<T> {
    const beUrl = environment.production
      ? `${this.baseUrl}/${endpoint}`
      : `${endpoint}`;
    return this.http.patch<T>(beUrl, body, {
      headers: this.getHeaders(headers),
    });
  }

  delete<T>(endpoint: string, headers?: object): Observable<T> {
    const beUrl = environment.production
      ? `${this.baseUrl}/${endpoint}`
      : `${endpoint}`;
    return this.http.delete<T>(beUrl, {
      headers: this.getHeaders(headers),
    });
  }
}
