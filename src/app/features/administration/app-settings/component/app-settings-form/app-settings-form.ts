import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { AppSettingsDTO } from './app.settings.model.dto';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { SelectNg } from "../../../../../shared/custom/select-ng/select-ng";
import { InputNg } from "../../../../../shared/custom/input-ng/input-ng";
import { InputNumberNg } from "../../../../../shared/custom/input-number-ng/input-number-ng";
import { ToggleButtonNg } from "../../../../../shared/custom/toggle-button-ng/toggle-button-ng";
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-app-settings-form',
  imports: [LoadingBlock, SelectNg, FormField, InputNg, InputNumberNg, ToggleButtonNg],
  templateUrl: './app-settings-form.html',
  styleUrl: './app-settings-form.css',
})
export class AppSettingsForm implements OnInit {
  private api = inject(ApiService);
  private nt = inject(NotificationService)

  showLoader = signal(false);
  textLoader = signal('Cargando...');

  emailProvider = [
    { id: 'None', label: 'Ninguno' },
    { id: 'FluentEmail', label: 'Smtp' },
    { id: 'Resend', label: 'Resend' },
    { id: 'SendGrid', label: 'SendGrid' },
  ];

  entityModel = signal<AppSettingsDTO>({
    id: '',
    emailProvider: 'None',
    smtpHost: '',
    smtpPort: 0,
    smtpUserName: '',
    smtpUserPassword: '',
    smtpEnableSsl: false,
    sender: '',
    apiKey: '',
    apiEmail: '',
    concurrencyStamp: '',
  });

  entityForm = form(this.entityModel, (path) => {
    required(path.emailProvider, { message: 'Proveedor de correo requerido' });
    email(path.smtpUserName, { message: 'Correo electrónico incorrecto' });
    email(path.apiEmail, { message: 'Correo electrónico incorrecto' });
    // Requerido para SMTP
    required(path.smtpHost, {
      message: 'Servidor SMTP requerido',
      when: ({ valueOf }) => valueOf(path.emailProvider) === 'FluentEmail',
    });

    required(path.smtpUserName, {
      message: 'Usuario requerido',
      when: ({ valueOf }) => valueOf(path.emailProvider) === 'FluentEmail',
    });    

    // Requerido para Resend y SendGrid
    required(path.apiKey, {
      message: 'Api key requerida',
      when: ({ valueOf }) =>
        valueOf(path.emailProvider) === 'Resend' || valueOf(path.emailProvider) === 'SendGrid',
    });

    required(path.apiEmail, {
      message: 'Correo electrónico requerido',
      when: ({ valueOf }) =>
        valueOf(path.emailProvider) === 'Resend' || valueOf(path.emailProvider) === 'SendGrid',
    });
  });

  selectedProvider = computed(() => this.entityModel().emailProvider);
  isFormValid = computed(() => this.entityForm().valid());

  constructor() {
    effect(() => {
      const provider = this.selectedProvider();

      this.entityModel.update((model) => {
        if (provider === 'None') {
          return {
            ...model,
            smtpHost: '',
            smtpPort: 0,
            smtpUserName: '',
            smtpUserPassword: '',
            smtpEnableSsl: false,
            apiKey: '',
            apiEmail: '',
          };
        }

        if (provider === 'Resend' || provider === 'SendGrid') {
          return {
            ...model,
            smtpHost: '',
            smtpPort: 0,
            smtpUserName: '',
            smtpUserPassword: '',
            smtpEnableSsl: false,
          };
        }

        // FluentEmail (Smtp)
        return {
          ...model,
          apiKey: '',
          apiEmail: '',
        };
      });
    });
  }

  ngOnInit(): void {
    this.showLoader.set(true);
    this.api.get<AppSettingsDTO>(`appsettings`).subscribe({
      next: (res) => {
        this.entityModel.set(res);
        this.showLoader.set(false);
      },
      error: () => this.showLoader.set(false),
    });
  }

  async onSubmit() {
    this.showLoader.set(true)
    this.textLoader.set('Actualizando...')
    const ok = await submit(this.entityForm, {
      action: async (raw) => {
        const result = await firstValueFrom(this.api.put<AppSettingsDTO>('appsettings', raw().value()));
        return;
      },
    });

    if (ok) 
      this.nt.showSuccess('Éxito', 'Información actualizada correctamente');
      
    this.showLoader.set(false);
  }
}
