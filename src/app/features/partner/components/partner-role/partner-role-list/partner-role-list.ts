import { Component, inject, model } from '@angular/core';
import { PartnerRoleDTO, PartnerRoleListDTO } from '../partner.role.model.dto';
import { urlPartnerRole } from '../../../../../core/services/endpoint.service';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";

@Component({
  selector: 'app-partner-role-list',
  imports: [TableView, TableColumn],
  templateUrl: './partner-role-list.html',
  styleUrl: './partner-role-list.css',
})
export class PartnerRoleList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlPartnerRole}/paged`;

  onRowClick(row: rowData<PartnerRoleListDTO>) {
    import('../partner-role-form/partner-role-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerRoleForm, {
        header: 'Editar Rol Socio',
        data: { entityId: row.id },
        modal: true,
        closable: true,
        closeOnEscape: false,
        width: '500px',
        breakpoints: { '400px': '95vw' },
      });
      this.ref?.onClose.subscribe((res: boolean) => {
        if (res) this.refresh.set(true);
      });
    });
  }

  onAddNew() {
    import('../partner-role-form/partner-role-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerRoleForm, {
        header: 'Crear Rol Socio',
        modal: true,
        closable: true,
        closeOnEscape: false,
        width: '500px',
        breakpoints: { '400px': '95vw' },
      });
      this.ref?.onClose.subscribe((res: boolean) => {
        if (res) this.refresh.set(true);
      });
    });
  }

  onDelete(row: PartnerRoleDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el rol ${row.name ?? ''}?`,
      header: `Eliminar Rol`,
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
        this.api.delete(`${urlPartnerRole}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
