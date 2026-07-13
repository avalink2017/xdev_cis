import { Component, ComponentRef, computed, inject, inputBinding, model, OnInit, signal, viewChild, ViewContainerRef } from '@angular/core';
import { urlAsset } from '../../../../../core/services/endpoint.service';
import { AssetDTO, AssetListDTO } from '../asset.model.dto';
import { ConfirmationService } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Actives, severityNG } from '../../../../../core/model/shared.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { AssetService } from '../service/asset-service';
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Tag } from 'primeng/tag';
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";

@Component({
  selector: 'app-asset-list',
  imports: [TableView, TableColumn, Select, FormsModule, Drawer, DatePicker, Tag, Button, Icon],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.css',
  providers: [AssetService],
})
export class AssetList implements OnInit {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);
  assetService = inject(AssetService);

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');
  private formRef = signal<ComponentRef<any> | undefined>(undefined);
  isFormValid = computed(() => this.formRef()?.instance.formValid());

  actives = Actives;
  showDrawer = signal(false);
  drawerTitle = signal<string>('Crear Activo Fijo');

  url = `${urlAsset}/paged`;

  ngOnInit(): void {}

  onRowClick(row: rowData<AssetListDTO>) {
    this.drawerTitle.set('Modificar Activo Fijo');
    this.showDrawer.set(true);
    this.createComponent(row.id);
  }

  onAddNew() {
    this.drawerTitle.set('Crear Activo Fijo');
    this.showDrawer.set(true);
    this.createComponent(null);
  }

  onDelete(row: AssetDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Activo Fijo #${row.inventoryCode ?? ''}?`,
      header: `Eliminar Activo Fijo`,
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
        this.api.delete(`${urlAsset}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }

  createComponent(entityId: string | null) {
    this.container().clear();
    import('../asset-form/asset-form').then((m) => {
      const ref = this.container().createComponent(m.AssetForm, {
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

  submit(){
    this.formRef()?.instance.onSubmit();
  }

  resolveSeverity(statusId: string): typeof severityNG {
    const sev = this.assetService.statusList().find(f => f.id === statusId)
    if (sev)
      return sev.severity as typeof severityNG

    return null
  }
}
