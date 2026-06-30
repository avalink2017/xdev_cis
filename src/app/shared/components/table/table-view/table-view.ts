import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  inputBinding,
  model,
  OnInit,
  output,
  outputBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TableColumn } from '../table-column/table-column';
import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Paginator } from 'primeng/paginator';
import { TableFilterText } from '../filters/table-filter-text/table-filter-text';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { TableService } from '../../../../core/services/table.service';
import { ApiPagedService } from '../../../../core/services/api.paged.service';

export interface rowData<T> {
  id: any;
  data: T;
}

@Component({
  selector: 'app-table-view',
  imports: [
    TableModule,
    DatePipe,
    DecimalPipe,
    Checkbox,
    FormsModule,
    Paginator,
    NgTemplateOutlet,
    TableFilterText,
    NgClass,
    Button,
    Message,
    Skeleton,
  ],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  providers: [TableService, ApiPagedService],
})
export class TableView<T> implements OnInit {
  url = input.required<string>();
  dataKey = input.required<string>();
  allowDelete = input<boolean>(true);
  allowSelect = input<boolean>(false);
  allowAddNew = input<boolean>(true);
  allowImport = input<boolean>(false);
  allowExport = input<boolean>(false);
  allowRefresh = input<boolean>(true);
  showToolBar = input(true);
  emptyMessage = input<string>('Sin datos');

  refresh = model<boolean>(false);
  clickable = input<boolean>(false);

  onAddNew = output<void>();
  onDelete = output<T>();
  rowClick = output<rowData<T>>();
  onImport = output<void>();
  onExport = output<void>();

  size: 'small' | 'large' | undefined;

  container = viewChild.required('toolbar', { read: ViewContainerRef });

  classHeader =
    '[:not(:hover)]:bg-surface-50! hover:bg-surface-200! dark:[:not(:hover)]:bg-surface-800! dark:hover:bg-surface-700! text-nowrap!';

  tableService = inject(TableService<T>);

  columns = contentChildren(TableColumn);

  hasFilters = computed(() => this.columns().some((c) => c.filterable()));

  data!: any[T];

  constructor() {
    effect(() => {
      if (this.refresh()) {
        this.tableService.loadData();
        this.refresh.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.data = Array.from({ length: 5 }).map((_, i) => `Item #${i}`);

    if (this.allowAddNew() || this.allowRefresh()) this.createToolbar();
    this.tableService.init({ url: this.url() });
    this.tableService.loadData();
  }

  getNumberFormat(decimals: number) {
    return `1.${decimals}-${decimals}`;
  }

  onFilterEnter(event: any, filterCallback: Function): void {
    filterCallback(event.target.value);
  }

  onRowClick(event: MouseEvent, row: any): void {
    const target = event.target as HTMLElement;
    const interactive = target.closest(
      'button, a, input, select, textarea, [role="button"], p-button, p-checkbox',
    );
    if (interactive) return;
    this.rowClick.emit({ id: row[this.dataKey()], data: row });
  }

  createToolbar() {
    if (this.showToolBar())
      import('../table-toolbar/table-toolbar').then((m) => {
        this.container().createComponent(m.TableToolbar, {
          bindings: [
            inputBinding('allowAddNew', this.allowAddNew),
            inputBinding('allowRefresh', this.allowRefresh),
            inputBinding('allowImport', this.allowImport),
            inputBinding('allowExport', this.allowExport),

            outputBinding<boolean>('addNew', () => {
              if (this.allowAddNew()) this.onAddNew.emit();
            }),
            outputBinding<boolean>('refresh', () => this.tableService.loadData()),
            outputBinding<boolean>('import', () => this.onImport.emit()),
            outputBinding<boolean>('export', () => this.onExport.emit()),
          ],
        });
      });
  }
}
