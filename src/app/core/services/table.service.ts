import { inject, Injectable, input, signal } from '@angular/core';

import { PaginatorState } from 'primeng/paginator';
import { TableLazyLoadEvent } from 'primeng/table';
import { FilterMetadata } from 'primeng/api';
import { tap } from 'rxjs';
import { PaginationDTO } from '../model/paginatio.model.dto';
import { ApiPagedService } from './api.paged.service';
import { NotificationService } from './notification.service';

export interface TableConfig {
  url: string;
}

export interface Column {
  field: string;
  header: string;
}

@Injectable()
export class TableService<T> {
  private config?: TableConfig;

  nt = inject(NotificationService);
  api = inject(ApiPagedService);

  private pagedSignal = signal<PaginationDTO>({
    page: 1,
    pageSize: 10,
    filter: '',
    sortField: '',
    sortOrder: 0,
  });

  private firstSignal = signal(0);
  private pageLinkSizeSignal = signal(5);
  private preSortOrderSignal = signal(0);
  tableFilters: Record<string, any> = {};

  init(cfg: TableConfig) {
    this.config = cfg;
  }

  loadData() {
    if (this.config && this.config.url)
      this.api
        .fetchData<T[]>(this.config!.url, this.pagedSignal())
        // .pipe(
        //   tap((resp) => {
        //     console.log(resp.body);
        //   }),
        // )
        .subscribe({ error: (error) => {} });

    if (!this.config || !this.config.url)
      this.nt.showError('API Service', 'Revise la configuración del servicio');
  }

  onPageChange(event: PaginatorState) {
    const rows = event.rows ?? this.pagedSignal().pageSize;
    this.firstSignal.set(event.first ?? 0);

    const pageIndex = Math.floor(this.firstSignal() / rows);
    this.pagedSignal().page = pageIndex + 1;
    this.pagedSignal().pageSize = rows;

    this.loadData();
  }

  lazyLoad(event: TableLazyLoadEvent) {
    if (event.sortField) {
      this.pagedSignal().sortField = Array.isArray(event.sortField)
        ? event.sortField[0]
        : event.sortField!;
      this.pagedSignal().sortOrder = event.sortOrder === 1 ? 0 : 1;
      this.preSortOrderSignal.set(event.sortOrder!);
    } else {
      this.pagedSignal().sortField = '';
      this.pagedSignal().sortOrder = 0;
    }

    this.tableFilters = { ...event.filters };

    const params: Record<string, any> = {};
    Object.entries(event.filters!).forEach(([field, meta]) => {
      // Puede venir como FilterMetadata o array de FilterMetadata
      const metas = Array.isArray(meta) ? meta : [meta];

      metas.forEach((m, idx) => {
        const value = (m as FilterMetadata).value;

        // Excluir null, undefined o, en strings, cadenas vacías
        if (value == null) {
          return;
        }
        if (typeof value === 'string' && value.trim() === '') {
          return;
        }

        // const out = value instanceof Date ? (value as Date).toISOString() : value;
        let out = value;
        if (value instanceof Date) {
          // Si solo quieres la fecha: out = value.toISOString().substring(0, 10);
          out = value.toISOString();
        } else {
          out = value;
        }

        // Si hubo varios metadatos en array, los numeramos;
        // si solo hay uno, usamos directamente el nombre de campo.
        const key = metas.length > 1 ? `${field}[${idx}]` : field;
        params[key] = out;
      });

      this.pagedSignal().filter = JSON.stringify(params);
    });

    this.loadData();
  }

  get data() {
    return this.api.data;
  }

  get loading() {
    return this.api.loading;
  }

  get paged() {
    return this.pagedSignal();
  }

  get totalRecords() {
    return this.api.totalRecords;
  }

  get totalPages() {
    return this.api.totalPages;
  }

  get first() {
    return this.firstSignal();
  }

  get pageLinkSize() {
    return this.pageLinkSizeSignal();
  }

  get preSortOrder() {
    return this.preSortOrderSignal();
  }

  get pageSize() {
    return this.pagedSignal().pageSize;
  }
}
