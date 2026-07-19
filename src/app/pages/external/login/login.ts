import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AutoFocusModule } from 'primeng/autofocus';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-login',
  imports: [FormField, Button, Icon, InputIcon, IconField, InputText, Message, AutoFocusModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');

  loginForm = form<{ email: string; password: string }>(
    signal({ email: '', password: '' }),
    (schemaPath) => {
      required(schemaPath.email, { message: 'Correo requerido' });
      required(schemaPath.password, { message: 'Contraseña requerida' });
    },
  );

  async onLogin() {
    this.error.set('');
    const ok = await submit(this.loginForm, {
      action: async () => {
        const { email, password } = this.loginForm().value();
        const result = await firstValueFrom(this.auth.login(email!, password!));
        return;
      },
    });

    if (ok) this.router.navigate(['/app']);

    if (!ok && !this.loginForm().invalid()) {
      this.error.set('Inicio de Sesión Incorrecto');
    }
  }
}
