import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { AssetLocationDTO } from '../asset-location.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlAssetLocation } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";
import { firstValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-location-form',
  imports: [FormField, InputNg, Button, Icon, LoadingBlock],
  templateUrl: './asset-location-form.html',
  styleUrl: './asset-location-form.css',
})
export class AssetLocationForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true)
  private model = signal<AssetLocationDTO>({
    id: '',
    name: '',
    concurrencyStamp: '',
  });

  form = form<AssetLocationDTO>(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<AssetLocationDTO>(`${urlAssetLocation}/${entityId}`).subscribe({
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
            ? this.api.post<ApiResponse<AssetLocationDTO>>(`${urlAssetLocation}`, raw().value())
            : this.api.put<ApiResponse<AssetLocationDTO>>(`${urlAssetLocation}`, raw().value()),
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
