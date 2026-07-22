import { Component, inject, model } from '@angular/core';
import { urlSigner } from '../../../../../core/services/endpoint.service';
import { SignerDTO, SignerListDTO } from '../signer.model.dto';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";

@Component({
  selector: 'app-signer-list',
  imports: [TableView, TableColumn],
  templateUrl: './signer-list.html',
  styleUrl: './signer-list.css',
})
export class SignerList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlSigner}/paged`;

  onRowClick(row: rowData<SignerListDTO>) {
    import('../signer-form/signer-form').then((m) => {
      this.ref = this.dialogService.open(m.SignerForm, {
        header: 'Editar Firmador',
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
    import('../signer-form/signer-form').then((m) => {
      this.ref = this.dialogService.open(m.SignerForm, {
        header: 'Crear Firmador',
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

  onDelete(row: SignerDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Firmador ${row.name ?? ''}?`,
      header: `Eliminar Firmado`,
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
        this.api.delete(`${urlSigner}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
