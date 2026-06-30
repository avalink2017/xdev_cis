import { Component, inject, OnInit, signal } from '@angular/core';
import { PartnerCategoryDTO } from '../partner.category.model.dto';
import { urlPartnerCategory } from '../../../../../core/services/endpoint.service';
import { form, disabled, required, maxLength, FormRoot, FormField } from '@angular/forms/signals';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";

@Component({
  selector: 'app-partner-category-form',
  imports: [InputNg, FormRoot, FormField, Button, Icon, LoadingBlock],
  templateUrl: './partner-category-form.html',
  styleUrl: './partner-category-form.css',
})
export class PartnerCategoryForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true);

  private model = signal<PartnerCategoryDTO>({
    id: '',
    code: '',
    name: '',
    concurrencyStamp: '',
  });

  form = form(
    this.model,
    (schemaPath) => {
      disabled(schemaPath.code, ({ valueOf }) => valueOf(schemaPath.id) !== '');
      required(schemaPath.code, { message: 'Código requerido' });
      maxLength(schemaPath.code, 4, { message: 'Longitud máxima 4' });
      required(schemaPath.name, { message: 'Nombre requerido' });
      maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.isNew()
              ? this.api.post<ApiResponse<PartnerCategoryDTO>>(
                  `${urlPartnerCategory}`,
                  raw().value(),
                )
              : this.api.put<ApiResponse<PartnerCategoryDTO>>(
                  `${urlPartnerCategory}`,
                  raw().value(),
                ),
          );
          this.nt.showSuccess('Éxito', 'Registro guardado correctamente');
          this.ref.close(true);
          return;
        },
      },
    },
  );

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<PartnerCategoryDTO>(`${urlPartnerCategory}/${entityId}`).subscribe({
        next: (res) => {
          this.model.set(res);
          this.isNew.set(false);
        },
      });
  }

  formClose(ret: boolean) {
    this.ref.close(ret);
  }
}
