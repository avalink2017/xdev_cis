import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { AssetCategoryDTO } from '../asset-category.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlAssetCategory } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";
import { firstValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SearchAutocomplete } from "../../../../../shared/custom/search-autocomplete/search-autocomplete";

@Component({
  selector: 'app-asset-category-form',
  imports: [FormField, InputNg, Button, Icon, LoadingBlock, SearchAutocomplete],
  templateUrl: './asset-category-form.html',
  styleUrl: './asset-category-form.css',
})
export class AssetCategoryForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  isNew = signal(true)
  private model = signal<AssetCategoryDTO>({
    id: '',
    code:'',
    name: '',
    rangeId:'',
    concurrencyStamp: '',
  });

  form = form<AssetCategoryDTO>(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    required(schemaPath.code,{message:'Código requerido'});
    disabled(schemaPath.code, ({ valueOf }) => valueOf(schemaPath.id) !== '');
    maxLength(schemaPath.code, 10, { message: 'Longitud máxima 10' });
    required(schemaPath.rangeId,{message:'Rango de números requerido'})
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<AssetCategoryDTO>(`${urlAssetCategory}/${entityId}`).subscribe({
        next: (res) => {
          this.model.set(res);
          this.isNew.set(false)
        },
      });
  }

  async onSubmit() {
    const ok = await submit(this.form, {
      action: async (raw) => {
        await firstValueFrom(
          this.isNew()
            ? this.api.post<ApiResponse<AssetCategoryDTO>>(`${urlAssetCategory}`, raw().value())
            : this.api.put<ApiResponse<AssetCategoryDTO>>(`${urlAssetCategory}`, raw().value()),
        );
      },
    });

    if (ok) {
      this.nt.showSuccess('Éxito', 'Registro guardado correctamente');
      this.formClose(true);
    }
  }

  formClose(ret: boolean) {
    this.ref.close(ret);
  }
}
