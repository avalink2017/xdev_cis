import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { UserDTO } from '../user.model.dto';
import {
  disabled,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  validateStandardSchema,
  validateTree,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlRole, urlUser } from '../../../../../core/services/endpoint.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormsModule } from '@angular/forms';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';
import z, { email } from 'zod';
import { RoleListDTO } from '../../../role/component/role.model.dto';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from "primeng/message";

@Component({
  selector: 'app-user-form',
  imports: [FormField, FormRoot, FormsModule, InputNg, Button, Icon, LoadingBlock, ToggleButtonNg, MultiSelect, Message],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  entityId = input<string | null>(null);
  formClose = output<boolean>();

  private api = inject(ApiService);
  private nt = inject(NotificationService);
  roleList = signal<RoleListDTO[]>([]);

  isNew = signal(true);

  private model = signal<UserDTO>({
    id: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    active: true,
    roles:[] as string[],
    concurrencyStamp: '',
  });

  formSchema = computed(() => {
    return z
      .object({
        email: z.email('Correo electrónico incorrecto').max(100, { error: 'Longitud máxima 100' }),
        name: z
          .string()
          .min(1, { error: 'Nombre de usuario requerido' })
          .max(100, { error: 'Longitud máxima 100' }),
        password: this.isNew()
          ? z
              .string()
              .min(1, { error: 'Contraseña requerida' })
              .max(50, { error: 'Longitud máxima 50' })
          : z.string().max(50, { error: 'Longitud máxima 50' }).optional(),
        confirmPassword: this.isNew()
          ? z
              .string()
              .min(1, { error: 'Confirme la contraseña' })
              .max(50, { error: 'Longitud máxima 50' })
          : z.string().max(50, { error: 'Longitud máxima 50' }).optional(),
      })
      .refine((data) => !this.isNew() || data.password === data.confirmPassword, {
        error: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
  });

  form = form(
    this.model,
    (schemaPath) => {
      disabled(schemaPath.email, ({ valueOf }) => valueOf(schemaPath.id) !== '');
      minLength(schemaPath.roles, 1, { message: 'Debe seleccionar al menos un rol' });
      validateStandardSchema(schemaPath, () => this.formSchema());
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.isNew()
              ? this.api.post<UserDTO>(`${urlUser}`, raw().value())
              : this.api.put<UserDTO>(`${urlUser}`, raw().value()),
          );
          this.nt.showSuccess(
            'Éxito',
            this.isNew() ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente',
          );
          this.formClose.emit(true);
          return;
        },
      },
    },
  );

  ngOnInit(): void {
    this.api
      .get<RoleListDTO[]>(`${urlRole}/list`)
      .subscribe({ next: (res) => this.roleList.set(res) });

    if (this.entityId())
      this.api.get<UserDTO>(`${urlUser}/${this.entityId()}`).subscribe({
        next: (res) => {
          res.password = '';
          res.confirmPassword = '';
          this.model.set(res);
          this.isNew.set(false);
        },
      });
  }
}
