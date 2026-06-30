import { Component, inject, inputBinding, model, OnInit, signal, viewChild, ViewContainerRef } from '@angular/core';
import { urlPartner } from '../../../../../core/services/endpoint.service';
import { PartnerDTO, PartnerListDTO } from '../partner.model.dto';
import { ConfirmationService } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Actives } from '../../../../../core/model/shared,model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { PartnerService } from '../service/partner-service';
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner-list',
  imports: [TableView, TableColumn, Select, FormsModule, Drawer],
  templateUrl: './partner-list.html',
  styleUrl: './partner-list.css',
  providers:[PartnerService]
})
export class PartnerList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);  
  partnerService = inject(PartnerService)

  private container = viewChild.required('compo', { read: ViewContainerRef });
  private drawerRef = viewChild.required<Drawer>('drawerRef');

  actives = Actives;  
  showDrawer = signal(false);
  drawerTitle = signal<string>('Crear Socio');

  url = `${urlPartner}/paged`;  

  onRowClick(row: rowData<PartnerListDTO>) {
    this.drawerTitle.set('Modificar Socio');
    this.showDrawer.set(true);
    this.createComponent(row.id);
  }

  onAddNew() {
    this.drawerTitle.set('Crear Socio');
    this.showDrawer.set(true);
    this.createComponent(null);
  }

  onDelete(row: PartnerDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Socio ${row.name ?? ''}?`,
      header: `Eliminar Socio`,
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
        this.api.delete(`${urlPartner}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }

  createComponent(entityId: string | null) {
    this.container().clear();
    import('../partner-form/partner-form').then((m) => {
      const ref = this.container().createComponent(m.PartnerForm, {
        bindings: [inputBinding('entityId', () => entityId)],
      });
      ref.instance.formClose.subscribe((res) => {
        this.refresh.set(res);
        this.drawerRef().close(new Event('close'));
      });
    });
  }
}
