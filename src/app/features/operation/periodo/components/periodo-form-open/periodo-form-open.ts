import { Component, inject, OnInit, output, signal } from '@angular/core';
import { form, required, FormField, FormRoot, min } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { urlCierreMes, urlCuentaBanco } from '../../../../../core/services/endpoint.service';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { SelectNg } from "../../../../../shared/custom/select-ng/select-ng";
import { Months } from '../../../../../core/model/shared.model.dto';
import { InputNumberNg } from "../../../../../shared/custom/input-number-ng/input-number-ng";
import { Button } from "primeng/button";
import { Icon } from "../../../../../shared/components/icon/icon";
import { LoadingBlock } from "../../../../../shared/components/loading-block/loading-block";

interface ModelDTO {
  cuentaBancoId: string;
  month: string;
  year: number;
}

@Component({
  selector: 'app-periodo-form-open',
  imports: [FormRoot, FormField, SelectNg, InputNumberNg, Button, Icon, LoadingBlock],
  templateUrl: './periodo-form-open.html',
  styleUrl: './periodo-form-open.css',
})
export class PeriodoFormOpen implements OnInit {
  formClose = output<boolean>();

  private api = inject(ApiService);
  private nt = inject(NotificationService);

  cuentas = signal<CuentaBancoListDTO[]>([]);
  months = Months

  private model = signal({
    cuentaBancoId: '',
    month: String(new Date().getMonth() + 1),
    year: new Date().getFullYear(),
  });

  form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.cuentaBancoId, { message: 'Cuenta banco requerida' });
      required(schemaPath.month, {message:'Mes requerido'})
      min(schemaPath.year,2020,{message:'Año no permitido'})
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.api.post<ModelDTO>(`${urlCierreMes}/apertura`, raw().value()),
          );
          this.nt.showSuccess('Éxito', 'Período abierto');
          this.formClose.emit(true);
          return;
        },
      },
    },
  );

  ngOnInit(): void {
    this.api
      .get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`)
      .subscribe({ next: (res) => this.cuentas.set(res) });
  }
}
