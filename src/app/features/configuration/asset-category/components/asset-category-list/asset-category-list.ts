import { Component, inject, model } from '@angular/core';
import { rowData, TableView } from "../../../../../shared/components/table/table-view/table-view";
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { urlAssetCategory } from '../../../../../core/services/endpoint.service';
import { AssetCategoryDTO, AssetCategoryListDTO } from '../asset-category.model.dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-category-list',
  imports: [TableView, TableColumn, FormsModule],
  templateUrl: './asset-category-list.html',
  styleUrl: './asset-category-list.css',
})
export class AssetCategoryList {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);

  private ref?: DynamicDialogRef | null;
  private dialogService = inject(DialogService);

  url = `${urlAssetCategory}/paged`;

  onRowClick(row: rowData<AssetCategoryListDTO>) {
    import('../asset-category-form/asset-category-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetCategoryForm, {
        header: 'Editar Categoría de Activo',
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
    import('../asset-category-form/asset-category-form').then((m) => {
      this.ref = this.dialogService.open(m.AssetCategoryForm, {
        header: 'Crear Categoría de Activo',
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

  onDelete(row: AssetCategoryDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar la Categoría de Activo ${row.name ?? ''}?`,
      header: `Eliminar Categoría de Activo`,
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
        this.api.delete(`${urlAssetCategory}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
