import { Component, inject, model } from '@angular/core';
import { PartnerTypeDTO, PartnerTypeListDTO } from '../partner.type.model.dto';
import { urlPartnerType } from '../../../../../core/services/endpoint.service';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";

@Component({
  selector: 'app-partner-type-list',
  imports: [TableView, TableColumn],
  templateUrl: './partner-type-list.html',
  styleUrl: './partner-type-list.css',
})
export class PartnerTypeList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlPartnerType}/paged`;

  onRowClick(row: rowData<PartnerTypeListDTO>) {
    import('../partner-type-form/partner-type-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerTypeForm, {
        header: 'Editar Tipo Socio',
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
    import('../partner-type-form/partner-type-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerTypeForm, {
        header: 'Crear Tipo Socio',
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

  onDelete(row: PartnerTypeDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el tipo ${row.name ?? ''}?`,
      header: `Eliminar Tipo`,
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
        this.api.delete(`${urlPartnerType}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
