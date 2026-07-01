import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

  getFile(url: string, auto: boolean = false) {
    return this.http
      .get(`${this.baseUrl}/${url}`, {
        observe: 'response',
        responseType: 'blob',
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Descargar automáticamente el archivo
          const blob = new Blob([response.body!]);
          const fileUrl = window.URL.createObjectURL(blob);

          if (auto) {
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = this.getFilenameFromContentDisposition(contentDisposition);

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(fileUrl);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  private getFilenameFromContentDisposition(header: string | null): string {
    if (!header) return 'download.csv';

    // 1) Intentar con filename* (UTF-8)
    const filenameStarMatch = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (filenameStarMatch?.[1]) {
      return decodeURIComponent(filenameStarMatch[1].trim().replace(/"/g, ''));
    }

    // 2) Fallback a filename=
    const filenameMatch = header.match(/filename\s*=\s*"?([^";]+)"?/i);
    if (filenameMatch?.[1]) {
      return filenameMatch[1].trim();
    }

    return 'download.csv';
  }
}
