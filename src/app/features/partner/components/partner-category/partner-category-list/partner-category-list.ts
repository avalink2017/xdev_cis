import { Component, inject, model } from '@angular/core';
import { PartnerCategoryDTO, PartnerCategoryListDTO } from '../partner.category.model.dto';
import { urlPartnerCategory } from '../../../../../core/services/endpoint.service';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";

@Component({
  selector: 'app-partner-category-list',
  imports: [TableView, TableColumn],
  templateUrl: './partner-category-list.html',
  styleUrl: './partner-category-list.css',
})
export class PartnerCategoryList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);  

  url = `${urlPartnerCategory}/paged`;

  onRowClick(row: rowData<PartnerCategoryListDTO>) {
    import('../partner-category-form/partner-category-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerCategoryForm, {
        header: 'Editar Categoría Socio',
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
    import('../partner-category-form/partner-category-form').then((m) => {
      this.ref = this.dialogService.open(m.PartnerCategoryForm, {
        header: 'Crear Categoría Socio',
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

  onDelete(row: PartnerCategoryDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar la categoría ${row.name ?? ''}?`,
      header: `Eliminar Categoría`,
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
        this.api.delete(`${urlPartnerCategory}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
