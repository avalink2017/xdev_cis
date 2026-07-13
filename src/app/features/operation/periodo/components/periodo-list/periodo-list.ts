import {
  Component,
  computed,
  effect,
  inject,
  inputBinding,
  model,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ApiPagedService } from '../../../../../core/services/api.paged.service';
import { CierreMesListDTO } from '../periodo.model.dto';
import { TableService } from '../../../../../core/services/table.service';
import { urlCierreMes } from '../../../../../core/services/endpoint.service';
import { DataView, DataViewPassThrough } from 'primeng/dataview';
import { Drawer } from 'primeng/drawer';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { DeviceService } from '../../../../../core/services/device.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Months } from '../../../../../core/model/shared.model.dto';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Popover } from 'primeng/popover';
import { Paginator } from 'primeng/paginator';
import { Select } from "primeng/select";
import { Icon } from "../../../../../shared/components/icon/icon";
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-periodo-list',
  imports: [
    DataView,
    Drawer,
    Message,
    Button,
    DatePipe,
    DecimalPipe,
    Tag,
    InputGroup,
    InputGroupAddon,
    Popover,
    Paginator,
    Select,
    Icon,
    FormsModule,
    InputText,
    InputNumber,
    DatePicker,
  ],
  templateUrl: './periodo-list.html',
  styleUrl: './periodo-list.css',
  providers: [TableService, ApiPagedService],
})
export class PeriodoList implements OnInit {
  refresh = model<boolean>(false);
  tableService = inject(TableService<CierreMesListDTO>);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');
  showDrawer = signal(false);
  drawerTitle = signal<string>('');
  device = inject(DeviceService);
  months = Months;

  sortField = signal<string | undefined>(undefined);
  sortOrder = signal<number>(1);
  sortIconName = computed(() => {
    const field = this.sortField();
    if (!field) return 'LucideArrowUpDown';
    return this.sortOrder() === 1 ? 'LucideArrowUp' : 'LucideArrowDown';
  });
  filterField = signal<string | undefined>(undefined);
  filterValue = signal<any>(undefined);

  fields = [
    { label: 'Cuenta', value: 'cuentaBancoNumero' },
    { label: 'Mes', value: 'month' },
    { label: 'Año', value: 'year' },
    { label: 'Fecha apertura', value: 'fechaApertura' },
    { label: 'Fecha cierre', value: 'fechaCierre' },
    { label: 'Estado', value: 'cerrado' },
  ];

  constructor() {
    effect(() => {
      if (this.refresh()) {
        this.tableService.loadData();
        this.refresh.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.tableService.init({ url: `${urlCierreMes}/paged` });
    this.tableService.loadData();
  }

  onSortFieldChange(field: string | undefined) {
    if (this.sortField() === field && field) {
      this.sortOrder.update(o => (o === 1 ? -1 : 1));
    } else if (field) {
      this.sortOrder.set(1);
    }
    this.sortField.set(field);
    this.applySortFilter();
  }

  toggleSortOrder() {
    const field = this.sortField();
    if (!field) return;

    this.sortOrder.update(o => (o === 1 ? -1 : 1));
    this.applySortFilter();
  }

  onFilterFieldChange(field: string | undefined) {
    this.filterField.set(field);
    this.filterValue.set(undefined);

    if (!field) {
      this.applySortFilter();
    }
  }

  onFilterValueChange(value: any) {
    this.filterValue.set(value);
    this.applySortFilter();
  }

  private applySortFilter() {
    const sortField = this.sortField();
    const sortOrder = sortField ? this.sortOrder() : 0;
    const filterField = this.filterField();
    const filterValue = this.filterValue();
    const filters: Record<string, any> = {};

    if (filterField && filterValue !== undefined && filterValue !== null && filterValue !== '') {
      filters[filterField] = { value: filterValue, matchMode: 'contains' };
    }

    this.tableService.lazyLoad({
      sortField: sortField || '',
      sortOrder,
      filters,
    } as any);
  }

  onAddNew() {
    this.drawerTitle.set('Abrir Período');
    this.showDrawer.set(true);
    this.createComponent();
  }

  onClose(val: string) {
    this.drawerTitle.set('Cerrar Período');
    this.showDrawer.set(true);
    this.createCloseComponent(val);
  }

  private createComponent() {
    this.container().clear();
    import('../periodo-form-open/periodo-form-open').then((m) => {
      const ref = this.container().createComponent(m.PeriodoFormOpen);
      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res);
        this.drawerRef().close(new Event('close'));
      });
    });
  }

  private createCloseComponent(val: string) {
    this.container().clear();
    import('../periodo-form-close/periodo-form-close').then((m) => {
      const ref = this.container().createComponent(m.PeriodoFormClose, {
        bindings: [inputBinding('entityId', () => val)],
      });
      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res);
        this.drawerRef().close(new Event('close'));
      });
    });
  }

  resolveMonth(mes: number) {
    var model = this.months.find((f) => +f.value === mes);

    if (model) return model.label;

    return '';
  }
}
