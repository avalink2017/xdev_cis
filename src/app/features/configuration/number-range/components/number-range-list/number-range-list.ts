import { Component, ComponentRef, computed, inject, inputBinding, model, signal, viewChild, ViewContainerRef } from '@angular/core';
import { NumberRangeDTO, NumberRangeListDTO } from '../number.range.model.dto';
import { urlNumberRange } from '../../../../../core/services/endpoint.service';
import { ConfirmationService } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Actives, severityNG } from '../../../../../core/model/shared.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";

@Component({
  selector: 'app-number-range-list',
  imports: [TableView, TableColumn, Select, FormsModule, Drawer, Button, Icon],
  templateUrl: './number-range-list.html',
  styleUrl: './number-range-list.css',
})
export class NumberRangeList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);
  

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.formValid());

  actives = Actives;
  showDrawer = signal(false);
  drawerTitle = signal<string>('');

  url = `${urlNumberRange}/paged`;  

  onRowClick(row: rowData<NumberRangeListDTO>) {
    this.drawerTitle.set('Modificar Rango de Números');
    this.showDrawer.set(true);
    this.createComponent(row.id);
  }

  onAddNew() {
    this.drawerTitle.set('Crear Rango de Números');
    this.showDrawer.set(true);
    this.createComponent(null);
  }

  onDelete(row: NumberRangeDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el rango #${row.name ?? ''}?`,
      header: `Eliminar Rango de Números`,
      closable: true,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'contrast',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: '¡Si, Eliminar!',
        size: 'small',
        styleClass: 'ml-2!',
        severity: 'danger',
      },
      accept: () => {
        this.api.delete(`${urlNumberRange}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }

  createComponent(entityId: string | null) {
    this.container().clear();
    import('../number-range-form/number-range-form').then((m) => {
      const ref = this.container().createComponent(m.NumberRangeForm, {
        bindings: [inputBinding('entityId', () => entityId)],
      });

      this.formRef.set(ref);

      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res);
        this.formClose();
      });
    });
  }

  formClose() {
    this.drawerRef().close(new Event('close'));
  }

  submit() {
    this.formRef()?.instance.onSubmit();
  }  
}
