import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlBank } from '../../../../../core/services/endpoint.service';
import { BankDTO, BankListDTO } from '../bank.model.dto';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { Select } from "primeng/select";
import { Actives } from '../../../../../core/model/shared,model.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-list',
  imports: [TableView, TableColumn, Select, FormsModule],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.css',
})
export class BankList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);  

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  actives = Actives;

  url = `${urlBank}/paged`;

  onRowClick(row: rowData<BankListDTO>) {
    import('../bank-form/bank-form').then((m) => {
      this.ref = this.dialogService.open(m.BankForm, {
        header: 'Editar Banco',
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
    import('../bank-form/bank-form').then((m) => {
      this.ref = this.dialogService.open(m.BankForm, {
        header: 'Crear Banco',
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

  onDelete(row: BankDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Banco ${row.name ?? ''}?`,
      header: `Eliminar Banco`,
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
        this.api.delete(`${urlBank}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
