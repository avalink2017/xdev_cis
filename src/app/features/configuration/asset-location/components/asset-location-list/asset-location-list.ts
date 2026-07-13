import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlAssetLocation } from '../../../../../core/services/endpoint.service';
import { AssetLocationDTO, AssetLocationListDTO } from '../asset-location.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-location-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './asset-location-list.html',
  styleUrl: './asset-location-list.css',
})
export class AssetLocationList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlAssetLocation}/paged`;

  onRowClick(row: rowData<AssetLocationListDTO>) {
    import('../asset-location-form/asset-location-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetLocationForm, {
        header: 'Editar Ubicación de Activo',
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
    import('../asset-location-form/asset-location-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetLocationForm, {
        header: 'Crear Ubicación de Activo',
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

  onDelete(row: AssetLocationDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar la Ubicación de Activo ${row.name ?? ''}?`,
      header: `Eliminar Ubicación de Activo`,
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
        this.api.delete(`${urlAssetLocation}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
