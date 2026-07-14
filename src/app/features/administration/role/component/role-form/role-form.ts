import { Component, inject, OnInit, signal } from '@angular/core';
import { RoleDTO } from '../role.model.dto';
import { disabled, form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { urlRole } from '../../../../../core/services/endpoint.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InputNg } from "../../../../../shared/custom/input-ng/input-ng";
import { ToggleButtonNg } from "../../../../../shared/custom/toggle-button-ng/toggle-button-ng";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";

@Component({
  selector: 'app-role-form',
  imports: [InputNg, ToggleButtonNg, FormField, Button, Icon, LoadingBlock],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm implements OnInit {
  private api = inject(ApiService);
  private ref = inject(DynamicDialogRef);
  private nt = inject(NotificationService);
  private config = inject(DynamicDialogConfig);
  private isNew = signal(true);
  private model = signal<RoleDTO>({
    id: '',
    name: '',
    roleName: '',
    isAdmin: false,
    concurrencyStamp: '',
  });

  roleForm = form(this.model, (schemaPath) => {
    disabled(schemaPath.name, ({ valueOf }) => valueOf(schemaPath.id) !== '');
    required(schemaPath.name, { message: 'Nombre rol requerido' });
    maxLength(schemaPath.name, 10, { message: 'Longitud máxima 10' });
    required(schemaPath.roleName, { message: 'Descripción requerida' });
    maxLength(schemaPath.roleName, 100, { message: 'Longitud máxima 50' });
  });

  ngOnInit(): void {
    const entityId = this.config.data?.entityId;
    if (entityId)
      this.api.get<RoleDTO>(`${urlRole}/${entityId}`).subscribe({
        next: (res) => {
          this.model.set(res);
          this.isNew.set(false);
        },
      });
  }

  async onSubmit() {
    const ok = await submit(this.roleForm, {
      action: async (raw) => {
        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<RoleDTO>(`${urlRole}`, raw().value())
            : this.api.put<RoleDTO>(`${urlRole}`, raw().value()),
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
