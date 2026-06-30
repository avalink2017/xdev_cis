import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlTpoIngreso } from '../../../../../core/services/endpoint.service';
import { TipoIngresoDTO, TipoIngresoListDTO } from '../tipo-ingreso.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { Actives } from '../../../../../core/model/shared,model.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-ingreso-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './tipo-ingreso-list.html',
  styleUrl: './tipo-ingreso-list.css',
})
export class TipoIngresoList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  actives = Actives

  url = `${urlTpoIngreso}/paged`;

  onRowClick(row: rowData<TipoIngresoListDTO>) {
    import('../tipo-ingreso-form/tipo-ingreso-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoIngresoForm, {
        header: 'Editar Tipo de Ingreso',
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
    import('../tipo-ingreso-form/tipo-ingreso-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoIngresoForm, {
        header: 'Crear Tipo Ingreso',
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

  onDelete(row: TipoIngresoDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Tipo Ingreso ${row.name ?? ''}?`,
      header: `Eliminar Tipo Ingreso`,
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
        this.api.delete(`${urlTpoIngreso}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
