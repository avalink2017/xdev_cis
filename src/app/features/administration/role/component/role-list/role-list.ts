import { Component, inject, model } from '@angular/core';
import { urlRole } from '../../../../../core/services/endpoint.service';
import { RoleDTO, RoleListDTO } from '../role.model.dto';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IS_ADMIN } from '../../../../../core/model/shared.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-list',
  imports: [TableView, TableColumn, Select, FormsModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  isadmin = IS_ADMIN;

  url = `${urlRole}/paged`;

  onRowClick(row: rowData<RoleListDTO>) {
    import('../role-form/role-form').then((m) => {
      this.ref = this.dialogService.open(m.RoleForm, {
        header: 'Editar Rol',
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
    import('../role-form/role-form').then((m) => {
      this.ref = this.dialogService.open(m.RoleForm, {
        header: 'Crear Rol',
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

  onDelete(row: RoleDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el rol ${row.name ?? ''}?`,
      header: `Eliminar Role`,
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
        this.api.delete(`${urlRole}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
