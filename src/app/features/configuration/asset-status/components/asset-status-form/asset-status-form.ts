import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { AssetStatusDTO } from '../asset-status.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlAssetStatus } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";
import { firstValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';

@Component({
  selector: 'app-asset-status-form',
  imports: [FormField, InputNg, Button, Icon, LoadingBlock, ToggleButtonNg],
  templateUrl: './asset-status-form.html',
  styleUrl: './asset-status-form.css',
})
export class AssetStatusForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true)
  private model = signal<AssetStatusDTO>({
    id: '',
    name: '',
    disposed:false,
    concurrencyStamp: '',
  });

  form = form<AssetStatusDTO>(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<AssetStatusDTO>(`${urlAssetStatus}/${entityId}`).subscribe({
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
            ? this.api.post<ApiResponse<AssetStatusDTO>>(`${urlAssetStatus}`, raw().value())
            : this.api.put<ApiResponse<AssetStatusDTO>>(`${urlAssetStatus}`, raw().value()),
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
