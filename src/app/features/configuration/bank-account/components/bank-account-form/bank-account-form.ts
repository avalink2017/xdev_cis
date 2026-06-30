import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import {
  disabled,
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';
import { CuentaBancoDTO, TIPO_CUENTA_OPTIONS } from '../bank-account.model.dto';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';
import { ApiService } from '../../../../../core/services/api.service';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { urlCuentaBanco } from '../../../../../core/services/endpoint.service';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormsModule } from '@angular/forms';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { BankAccountService } from '../services/bank.account.service';
import { DatePickerNg } from '../../../../../shared/custom/date-picker-ng/date-picker-ng';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';

@Component({
  selector: 'app-bank-account-form',
  imports: [
    FormsModule,
    FormField,
    FormRoot,
    InputNg,
    Button,
    Icon,
    ToggleButtonNg,
    LoadingBlock,
    SelectNg,
    DatePickerNg,
    InputNumberNg,
  ],
  templateUrl: './bank-account-form.html',
  styleUrl: './bank-account-form.css',
})
export class BankAccountForm implements OnInit {
  entityId = input<string | null>(null);
  formClose = output<boolean>();
  bankService = inject(BankAccountService);

  private api = inject(ApiService);
  private nt = inject(NotificationService);

  private isNew = computed(() => !this.entityId());

  private model = signal<CuentaBancoDTO>({
    id: '',
    nombre: '',
    numeroCuenta: '',
    bancoId: '',
    tipoCuenta: 'Ahorro',
    fechaApertura: new Date(),
    saldoInicial: 0,
    active: true,
    concurrencyStamp: '',
  });

  readonly tipoCuentaOptions = TIPO_CUENTA_OPTIONS;

  form = form(
    this.model,
    (schemaPath) => {
      disabled(schemaPath.numeroCuenta, ({ valueOf }) => valueOf(schemaPath.id) !== '');
      required(schemaPath.nombre, { message: 'Nombre requerido' });
      maxLength(schemaPath.nombre, 100, { message: 'Longitud máxima 100' });
      required(schemaPath.numeroCuenta, { message: 'Número de cuenta requerido' });
      maxLength(schemaPath.numeroCuenta, 30, { message: 'Longitud máxima 30' });
      required(schemaPath.bancoId, { message: 'Banco requerido' });
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.isNew()
              ? this.api.post<ApiResponse<CuentaBancoDTO>>(`${urlCuentaBanco}`, raw().value())
              : this.api.put<ApiResponse<CuentaBancoDTO>>(`${urlCuentaBanco}`, raw().value()),
          );
          this.nt.showSuccess('Éxito', 'Registro guardado correctamente');
          this.formClose.emit(true);
          return;
        },
      },
    },
  );

  ngOnInit(): void {
    if (this.entityId())
      this.api.get<CuentaBancoDTO>(`${urlCuentaBanco}/${this.entityId()}`).subscribe({
        next: (res) => {
          res.fechaApertura = new Date(res.fechaApertura)
          this.model.set(res);
        },
      });
  }  
}
