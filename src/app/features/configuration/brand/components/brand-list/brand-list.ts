import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from '../../../../../shared/components/table/table-column/table-column';
import { urlBrand } from '../../../../../core/services/endpoint.service';
import { BrandDTO, BrandListDTO } from '../brand.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './brand-list.html',
  styleUrl: './brand-list.css',
})
export class BrandList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlBrand}/paged`;

  onRowClick(row: rowData<BrandListDTO>) {
    import('../brand-form/brand-form').then((m) => {
      this.ref = this.dialogService.open(m.BrandForm, {
        header: 'Editar Marca',
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
    import('../brand-form/brand-form').then((m) => {
      this.ref = this.dialogService.open(m.BrandForm, {
        header: 'Crear Marca',
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

  onDelete(row: BrandDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar la Marca ${row.name ?? ''}?`,
      header: `Eliminar Marca`,
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
        this.api.delete(`${urlBrand}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
