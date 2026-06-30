import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlTpoEgreso } from '../../../../../core/services/endpoint.service';
import { TipoEgresoDTO, TipoEgresoListDTO } from '../tipo-egreso.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-egreso-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './tipo-egreso-list.html',
  styleUrl: './tipo-egreso-list.css',
})
export class TipoEgresoList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlTpoEgreso}/paged`;

  onRowClick(row: rowData<TipoEgresoListDTO>) {
    import('../tipo-egreso-form/tipo-egreso-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoEgresoForm, {
        header: 'Editar Tipo de Egreso',
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
    import('../tipo-egreso-form/tipo-egreso-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoEgresoForm, {
        header: 'Crear Tipo Egreso',
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

  onDelete(row: TipoEgresoDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Tipo Egreso ${row.name ?? ''}?`,
      header: `Eliminar Tipo Egreso`,
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
        this.api.delete(`${urlTpoEgreso}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
