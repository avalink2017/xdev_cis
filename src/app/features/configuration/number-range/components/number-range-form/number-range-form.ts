import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NumberRangeDTO } from '../number.range.model.dto';
import { form, maxLength, required, submit, FormField } from '@angular/forms/signals';
import { ApiService } from '../../../../../core/services/api.service';
import { urlNumberRange } from '../../../../../core/services/endpoint.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InputNg } from "../../../../../shared/custom/input-ng/input-ng";
import { InputNumberNg } from "../../../../../shared/custom/input-number-ng/input-number-ng";
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';

@Component({
  selector: 'app-number-range-form',
  imports: [InputNg, FormField, InputNumberNg, ToggleButtonNg],
  templateUrl: './number-range-form.html',
  styleUrl: './number-range-form.css',
})
export class NumberRangeForm implements OnInit {
  entityId = input<string | null>(null);
  formClose = output<boolean>();

  textLoading = signal<string>('');
  isLoading = signal(false);

  private api = inject(ApiService);
  private nt = inject(NotificationService)

  entityModel = signal<NumberRangeDTO>({
    id: '',
    name: '',
    numStart: 0,
    numEnd: 0,
    numCurrent: 0,
    prefix: '',
    active: true,
    concurrencyStamp: '',
  });

  entityForm = form(this.entityModel, (path) => {
    required(path.name, { message: 'Nombre requerido' });
    maxLength(path.name, 50, { message: 'Longitud máxima 50' });
    maxLength(path.prefix, 50, { message: 'Longitud máxima 10' });
  });

  formValid = computed(() => this.entityForm().valid());
  isNew = computed(() => this.entityForm().value().id === '');

  ngOnInit(): void {
    if (this.entityId()) {
      this.textLoading.set('Recuperando...');
      this.isLoading.set(true);
      this.api.get<NumberRangeDTO>(`${urlNumberRange}/${this.entityId()}`).subscribe({
        next: (res) => {
          this.entityModel.set(res);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  async onSubmit() {
    this.textLoading.set(this.isNew() ? 'Creando...' : 'Actualizando...');
    const ok = await submit(this.entityForm, {
      action: async (raw) => {
        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<NumberRangeDTO>(`${urlNumberRange}`, raw().value())
            : this.api.put<NumberRangeDTO>(`${urlNumberRange}`, raw().value()),
        );
        return;
      },
    });

    if (ok) {
      this.nt.showSuccess('Éxito', 'Registro guardado correctamente');
      this.formClose.emit(true);
    }
  }
}
