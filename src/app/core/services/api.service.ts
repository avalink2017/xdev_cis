import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(environment.apiKey ? { 'x-api-key': environment.apiKey } : {});
  }

  private options(params?: HttpParams) {
    return { headers: this.getHeaders(), params, withCredentials: true };
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, this.options(params));
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, this.options());
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, this.options());
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${url}`, body, this.options());
  }

  delete<T>(url: string, body?: any[]): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, {
      withCredentials: true,
      body: body,
      headers: this.getHeaders(),
    });
  }
}
