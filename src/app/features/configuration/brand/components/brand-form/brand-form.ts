import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { BrandDTO } from '../brand.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlBrand } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { firstValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-brand-form',
  imports: [FormField, InputNg, Button, Icon, LoadingBlock],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css',
})
export class BrandForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true);
  private model = signal<BrandDTO>({
    id: '',
    name: '',
    concurrencyStamp: '',
  });

  form = form<BrandDTO>(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<BrandDTO>(`${urlBrand}/${entityId}`).subscribe({
        next: (res) => {
          this.model.set(res);
          this.isNew.set(false);
        },
      });
  }

  async onSubmit() {
    const ok = await submit(this.form, {
      action: async (raw) => {
        await firstValueFrom(
          this.isNew()
            ? this.api.post<ApiResponse<BrandDTO>>(`${urlBrand}`, raw().value())
            : this.api.put<ApiResponse<BrandDTO>>(`${urlBrand}`, raw().value()),
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
