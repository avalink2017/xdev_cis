import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AutoFocusModule } from 'primeng/autofocus';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { Icon } from '../../shared/components/icon/icon';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { Message } from "primeng/message";

@Component({
  selector: 'app-login2',
  imports: [FormField, Button, Icon, InputIcon, IconField, InputText, Message,AutoFocusModule],
  template: `
    <div class="relative flex flex-col items-center justify-center px-4 py-12">
      <!-- <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          class="absolute -top-40 right-0 h-125 w-125 rounded-full bg-primary-200/15 dark:bg-primary-900/20 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 left-0 h-125 w-125 rounded-full bg-primary-300/10 dark:bg-primary-800/15 blur-3xl"
        ></div>
      </div> -->

      <div class="w-full ">
        <div class="mb-4 flex flex-col items-center text-center">
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25"
          >
            <span class="text-2xl font-bold text-primary-contrast">CIS</span>
          </div>
          <h2 class="text-xl font-semibold text-muted-color-emphasis">Bienvenido</h2>
        </div>

        <div
          class="rounded-2xl bg-surface-0 p-8 shadow-2xl ring-1 ring-surface-200 dark:bg-surface-900 dark:ring-surface-700"
        >
          <h2 class="font-semibold text-xl text-center mb-5">Inicio de sesión</h2>
          <form class="space-y-5">
            <div class="flex flex-col gap-5">
              <div class="flex flex-col gap-1">
                <label for="email">Correo electrónico</label>
                <div>
                  <p-iconfield>
                    <p-inputicon class="pi pi-user" />
                    <input
                      type="email"
                      pInputText
                      id="email"
                      [formField]="loginForm.email"
                      fluid                      
                      [pAutoFocus]="true"
                    />
                  </p-iconfield>
                  @if (loginForm.email().touched() && loginForm.email().invalid()) {
                    @for (error of loginForm.email().errors(); track error) {
                      <p-message severity="error" size="small" variant="simple">{{
                        error.message
                      }}</p-message>
                    }
                  }
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label for="password">Contraseña</label>
                
              </div>
            </div>

            @if (error()) {
              <p class="text-sm text-red-400">{{ error() }}</p>
            }

            <p-button
              [disabled]="loginForm().submitting() || loginForm().invalid()"
              [label]="loginForm().submitting() ? 'Validando...' : 'Iniciar sesión'"
              fluid
              styleClass="w-full!"
              (onClick)="onLogin()"
            >
              <app-icon name="LucideLogIn" />
            </p-button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export default class LoginPage {
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
      this.error.set('Credenciales inválidas');
    }
  }
}
