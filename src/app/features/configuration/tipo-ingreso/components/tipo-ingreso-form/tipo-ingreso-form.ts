import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { TipoIngresoDTO } from '../tipo-ingreso.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlTpoIngreso } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";
import { firstValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-tipo-ingreso-form',
  imports: [FormField, InputNg, Button, Icon, LoadingBlock],
  templateUrl: './tipo-ingreso-form.html',
  styleUrl: './tipo-ingreso-form.css',
})
export class TipoIngresoForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true)
  private tipoIngresoModel = signal<TipoIngresoDTO>({
    id: '',
    code: '',
    name: '',
    concurrencyStamp: '',
  });

  form = form<TipoIngresoDTO>(this.tipoIngresoModel, (schemaPath) => {
    disabled(schemaPath.code, ({ valueOf }) => valueOf(schemaPath.id) !== '');
    required(schemaPath.code, { message: 'Código requerido' });
    maxLength(schemaPath.code, 4, { message: 'Longitud máxima 4' });
    required(schemaPath.name, { message: 'Nombre requerido' });
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<TipoIngresoDTO>(`${urlTpoIngreso}/${entityId}`).subscribe({
        next: (res) => {
          this.tipoIngresoModel.set(res);
          this.isNew.set(false)
        },
      });
  }

  async onSubmit() {
    const ok = await submit(this.form, {
      action: async (raw) => {
        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<ApiResponse<TipoIngresoDTO>>(`${urlTpoIngreso}`, raw().value())
            : this.api.put<ApiResponse<TipoIngresoDTO>>(`${urlTpoIngreso}`, raw().value()),
        );
        return;
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
