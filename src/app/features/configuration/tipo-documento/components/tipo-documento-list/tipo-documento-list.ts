import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlTpoDocumento } from '../../../../../core/services/endpoint.service';
import { TipoDocumentoDTO, TipoDocumentoListDTO } from '../tipo-documento.model.dto';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { Select } from "primeng/select";
import { Actives } from '../../../../../core/model/shared.model.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-documento-list',
  imports: [TableView, TableColumn, Select, FormsModule],
  templateUrl: './tipo-documento-list.html',
  styleUrl: './tipo-documento-list.css',
})
export class TipoDocumentoList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  actives = Actives;

  url = `${urlTpoDocumento}/paged`;

  onRowClick(row: rowData<TipoDocumentoListDTO>) {
    import('../tipo-documento-form/tipo-documento-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoDocumentoForm, {
        header: 'Editar Tipo Documento',
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
    import('../tipo-documento-form/tipo-documento-form').then((m) => {
      this.ref = this.dialogService.open(m.TipoDocumentoForm, {
        header: 'Crear Tipo Documento',
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

  onDelete(row: TipoDocumentoDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Tipo Documento ${row.name ?? ''}?`,
      header: `Eliminar Tipo Documento`,
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
        this.api.delete(`${urlTpoDocumento}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
