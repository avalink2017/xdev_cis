import { Component, contentChild, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table-column',
  imports: [],
  template: '',
})
export class TableColumn {
  field = input<string>();
  header = input<string>();
  width = input<string>();
  align = input<'left' | 'center' | 'right'>('left');
  sortable = input<boolean>(true);
  sortField = input<string>();
  filterable = input<boolean>(true);
  filterField = input<string>();  
  type = input<'text' | 'integer' | 'float' | 'date' | 'datetime' | 'boolean'>('text');
  decimals = input<number>(2);

  cellTemplate = contentChild('cell', { read: TemplateRef });
  filterTemplate = contentChild('filter', { read: TemplateRef });
}
