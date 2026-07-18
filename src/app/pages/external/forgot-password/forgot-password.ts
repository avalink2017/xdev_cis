import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Icon } from '../../../shared/components/icon/icon';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { Message } from 'primeng/message';
import { ApiService } from '../../../core/services/api.service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../core/model/api-response.model';

interface ForgotPasswordDTO {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  imports: [
    Button,
    Icon,
    IconField,
    InputIcon,
    FormsModule,
    FormField,
    AutoFocusModule,
    InputText,
    RouterLink,
    Message,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  success = signal(false);

  private api = inject(ApiService);

  fpModel = signal<ForgotPasswordDTO>({
    email: '',
  });

  fpForm = form(this.fpModel, (path) => {
    required(path.email, { message: 'Correo eletrónico requerido' });
  });

  async submit() {
    const ok = await submit(this.fpForm, {
      action: async () => {
        const dto = this.fpForm().value();
        const result = await firstValueFrom(
          this.api.post<ApiResponse>(`auth/forgotPassword`, dto)
        );
        return;
      },
    });

    this.success.set(true)
  }
}
