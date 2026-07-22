import { Component, inject, OnInit, signal } from '@angular/core';
import { SignerDTO } from '../signer.model.dto';
import { urlSigner } from '../../../../../core/services/endpoint.service';
import { form, disabled, required, submit, maxLength, FormField } from '@angular/forms/signals';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InputNg } from "../../../../../shared/custom/input-ng/input-ng";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";

@Component({
  selector: 'app-signer-form',
  imports: [InputNg, FormField, Button, Icon, LoadingBlock],
  templateUrl: './signer-form.html',
  styleUrl: './signer-form.css',
})
export class SignerForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true);
  private entityModel = signal<SignerDTO>({
    id: '',
    code: '',
    name: '',
    title:'',
    concurrencyStamp: '',
  });

  entityForm = form<SignerDTO>(this.entityModel, (schemaPath) => {
    disabled(schemaPath.code, ({ valueOf }) => valueOf(schemaPath.id) !== '');
    required(schemaPath.code, { message: 'Código requerido' });
    maxLength(schemaPath.code, 25, { message: 'Longitud máxima 25' });
    required(schemaPath.name, { message: 'Nombre requerido' });
    maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
    required(schemaPath.title, { message: 'Nombre requerido' });
    maxLength(schemaPath.title, 100, { message: 'Longitud máxima 100' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<SignerDTO>(`${urlSigner}/${entityId}`).subscribe({
        next: (res) => {
          this.entityModel.set(res);
          this.isNew.set(false);
        },
      });
  }

  async onSubmit() {
    const ok = await submit(this.entityForm, {
      action: async (raw) => {
        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<SignerDTO>(`${urlSigner}`, raw().value())
            : this.api.put<SignerDTO>(`${urlSigner}`, raw().value()),
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
