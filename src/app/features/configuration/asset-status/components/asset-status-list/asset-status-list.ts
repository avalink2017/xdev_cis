import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlAssetStatus } from '../../../../../core/services/endpoint.service';
import { AssetStatusDTO, AssetStatusListDTO } from '../asset-status.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-status-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './asset-status-list.html',
  styleUrl: './asset-status-list.css',
})
export class AssetStatusList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlAssetStatus}/paged`;

  onRowClick(row: rowData<AssetStatusListDTO>) {
    import('../asset-status-form/asset-status-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetStatusForm, {
        header: 'Editar Estado de Activo',
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
    import('../asset-status-form/asset-status-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetStatusForm, {
        header: 'Crear Estado de Activo',
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

  onDelete(row: AssetStatusDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Estado de Activo ${row.name ?? ''}?`,
      header: `Eliminar Estado de Activo`,
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
        this.api.delete(`${urlAssetStatus}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
