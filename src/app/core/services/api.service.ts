import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileResult {
  blob: Blob;
  filename: string;
}

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

  getFile(url: string): Observable<FileResult> {
    return this.http
      .get(`${this.baseUrl}/${url}`, {
        observe: 'response',
        responseType: 'blob',
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          const filename = this.parseFilename(contentDisposition);
          return { blob: response.body!, filename };
        }),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
  }

  downloadFile(url: string): Observable<void> {
    return this.getFile(url).pipe(
      map(({ blob, filename }) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(fileUrl);
      }),
    );
  }

  private parseFilename(header: string | null): string {
    if (!header) return 'download';

    const star = header.match(/filename\*\s*=\s*UTF-8''([^;\s]+)/i);
    if (star?.[1]) return decodeURIComponent(star[1]);

    const plain = header.match(/filename\s*=\s*"?([^";\n]+)"?/i);
    if (plain?.[1]) return plain[1].trim();

    return 'download';
  }
}
