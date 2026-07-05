import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot } from '@angular/forms/signals';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Months } from '../../../../../core/model/shared.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { urlCierreMes, urlCuentaBanco } from '../../../../../core/services/endpoint.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { CierreMesDTO } from '../periodo.model.dto';
import { FormsModule } from '@angular/forms';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { TextAreaNg } from '../../../../../shared/custom/text-area-ng/text-area-ng';

interface ModelDTO {
  id: string;
  cuentaBancoId: string;
  month: string;
  year: number;
  observacion: string;
}

@Component({
  selector: 'app-periodo-form-close',
  imports: [
    FormField,
    FormRoot,
    FormsModule,
    SelectNg,
    InputNumberNg,
    Button,
    Icon,
    LoadingBlock,
    TextAreaNg,
  ],
  templateUrl: './periodo-form-close.html',
  styleUrl: './periodo-form-close.css',
})
export class PeriodoFormClose implements OnInit {
  entityId = input<string | undefined>(undefined);
  formClose = output<boolean>();

  private api = inject(ApiService);
  private nt = inject(NotificationService);

  cuentas = signal<CuentaBancoListDTO[]>([]);
  months = Months;

  private model = signal<ModelDTO>({
    id: '',
    cuentaBancoId: '',
    month: '',
    year: 0,
    observacion: '',
  });

  form = form(
    this.model,
    (schemaPath) => {
      disabled(schemaPath.cuentaBancoId);
      disabled(schemaPath.month);
      disabled(schemaPath.year);
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.api.post<ModelDTO>(`${urlCierreMes}/cierre`, {
              id: raw().value().id,
              observacion: raw().value().observacion,
            }),
          );
          this.nt.showSuccess('Éxito', 'Período cerrado');
          this.formClose.emit(true);
          return;
        },
      },
    },
  );

  ngOnInit(): void {
    forkJoin({
      ls: this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`),
      et: this.api.get<CierreMesDTO>(`${urlCierreMes}/${this.entityId()}`),
    }).subscribe({
      next: ({ ls, et }) => {
        this.cuentas.set(ls);
        this.model.set({
          id: et.id!,
          cuentaBancoId: et.cuentaBancoId!,
          month: String(et.month),
          year: et.year,
          observacion: '',
        });
      },
    });
  }

  resolveMonth(mes: number) {
    var model = this.months.find((f) => +f.value === mes);

    if (model) return model.label;

    return '';
  }
}
