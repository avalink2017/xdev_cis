import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { PaginationDTO } from '../model/paginatio.model.dto';
import { CreateQueryParams } from '../functions/global.functions';
import { EndpointService } from './endpoint.service';

@Injectable()
export class ApiPagedService {
  http = inject(HttpClient);
  endpointService = inject(EndpointService);

  private dataSignal = signal<any | undefined>(undefined);
  private loadingSignal = signal(false);
  private totalRecordsSignal = signal(0);
  private totalPagesSignal = signal(0);

  get totalRecords(): Signal<number> {
    return this.totalRecordsSignal;
  }
  get totalPages(): Signal<number> {
    return this.totalPagesSignal;
  }

  get data(): Signal<any | undefined> {
    return this.dataSignal;
  }

  get loading(): Signal<boolean> {
    return this.loadingSignal;
  }

  fetchData<T>(endpoint: string, query?: PaginationDTO) {
    const url = this.endpointService.buildUrl(endpoint);
    this.dataSignal.set(undefined);
    this.loadingSignal.set(true);
    const queryParams = CreateQueryParams(query);

    return this.http
      .get<T>(url, {
        params: queryParams,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (response: HttpResponse<T>) => {
            this.dataSignal.set(response.body as T);
            this.totalRecordsSignal.set(parseInt(response.headers.get('Total-Count') || '0', 10));
            this.totalPagesSignal.set(parseInt(response.headers.get('Total-Pages') || '0', 10));
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        }),
      );
  }
}
