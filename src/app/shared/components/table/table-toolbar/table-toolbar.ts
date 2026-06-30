import { Component, computed, input, output } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Icon } from "../../icon/icon";

@Component({
  selector: 'app-table-toolbar',
  imports: [Toolbar, Button, Menu, Icon],
  template: `<p-toolbar class="rounded-none! border-0! px-1!">
    <ng-template #start>
      <div class="flex gap-3">
        @if (allowAddNew()) {
          <p-button label="Crear" icon="pi pi-plus" (onClick)="addNew.emit()" size="small" />
        }
        @if (allowRefresh()) {
          <p-button
            label="Refrescar"
            icon="pi pi-refresh"
            (onClick)="refresh.emit()"
            size="small"
          />
        }
      </div>
    </ng-template>
    <ng-template #end>
      @if (allowImport() || allowExport()) {
        <p-button severity="secondary" (onClick)="menu.toggle($event)" size="small">
          <app-icon name="LucideEllipsis" [size]="16" />
        </p-button>
        <p-menu #menu [model]="items()" [popup]="true" appendTo="body" />
      }
    </ng-template>
  </p-toolbar>`,
})
export class TableToolbar {
  allowAddNew = input<boolean>(true);
  allowRefresh = input<boolean>(true);
  allowImport = input<boolean>(false);
  allowExport = input<boolean>(false);

  addNew = output<void>();
  refresh = output<void>();
  import = output<void>();
  export = output<void>();

  // size = output<'small' | 'large' | undefined>(undefined);

  items = computed<MenuItem[]>(() => {
    const options: MenuItem[] = [];
    if (this.allowImport())
      options.push({ label: 'Import', icon: 'pi pi-upload', command: () => this.import.emit() });
    if (this.allowExport())
      options.push({ label: 'Export', icon: 'pi pi-download', command: () => this.export.emit() });
    return options.length ? [{ label: 'Opciones', items: options }] : [];
  });
}
