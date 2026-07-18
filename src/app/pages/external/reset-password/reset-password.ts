import { Component, inject, input, signal } from '@angular/core';
import { Icon } from '../../../shared/components/icon/icon';
import { Button } from 'primeng/button';
import { form, FormField, required, submit, validateTree } from '@angular/forms/signals';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../core/model/api-response.model';
import { ApiService } from '../../../core/services/api.service';

interface ResetPasswordDTO {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password',
  imports: [
    Icon,
    Button,
    IconField,
    InputIcon,
    FormField,
    AutoFocusModule,
    Message,
    InputText,
    RouterLink,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  email = input<string>();
  code = input<string>();

  private api = inject(ApiService)

  success = signal(false)

  entityModel = signal<ResetPasswordDTO>({
    password: '',
    confirmPassword: '',
  });

  entityForm = form(this.entityModel, (path) => {
    required(path.password, { message: 'Nueva contraseña es requerida' });
    required(path.confirmPassword, { message: 'Confirmación de contraseña es requerida' });
    validateTree(path, (ctx) => {
      const newPass = ctx.valueOf(path.password);
      const confirm = ctx.valueOf(path.confirmPassword);
      if (newPass && confirm && newPass !== confirm) {
        return {
          fieldTree: ctx.fieldTreeOf(path.confirmPassword),
          kind: 'password-mismatch',
          message: 'Las contraseñas no coinciden',
        };
      }
      return undefined;
    });
  });

  async onSubmit() {
    const ok = await submit(this.entityForm, {
      action: async (raw) => {     
        const dto = {email:this.email(), resetCode: this.code(), newPassword:raw().value().password}    
        const result = await firstValueFrom(this.api.post<ApiResponse>(`auth/resetPassword`, dto));
        return;
      },
    });

    this.success.set(true)
  }
}
