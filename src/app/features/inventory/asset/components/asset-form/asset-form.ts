import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { AssetDTO } from '../asset.model.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import {
  disabled,
  form,
  FormField,
  maxLength,
  min,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { urlAsset, urlPartner } from '../../../../../core/services/endpoint.service';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { TextAreaNg } from '../../../../../shared/custom/text-area-ng/text-area-ng';
import { AssetService } from '../service/asset-service';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';
import { SearchAutocomplete } from '../../../../../shared/custom/search-autocomplete/search-autocomplete';
import { DatePickerNg } from '../../../../../shared/custom/date-picker-ng/date-picker-ng';
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { AssetStatusListDTO } from '../../../../configuration/asset-status/components/asset-status.model.dto';

@Component({
  selector: 'app-asset-form',
  imports: [
    InputNg,
    FormField,
    TextAreaNg,
    SelectNg,
    InputNumberNg,
    SearchAutocomplete,
    DatePickerNg,
    ToggleButtonNg,
    LoadingBlock,
  ],
  templateUrl: './asset-form.html',
  styleUrl: './asset-form.css',
})
export class AssetForm implements OnInit {
  entityId = input<string | null>(null);
  formClose = output<boolean>();
  assetService = inject(AssetService);

  private api = inject(ApiService);
  private nt = inject(NotificationService);

  urlSearch = `${urlPartner}/search?rolecode=PR`;
  urlEntity = `${urlPartner}/{id}`;
  textLoading = signal<string>('');
  isLoading = signal(false);
  selectedStatus = signal<AssetStatusListDTO | undefined>(undefined);

  private model = signal<AssetDTO>({
    id: '',
    inventoryCode: '',
    description: '',
    brandId: '',
    serialNumber: '',
    model: '',
    color: '',
    invoiceNumber: '',
    price: 0,
    supplierId: '',
    purchaseDate: new Date(),
    fechaDescargo: null,
    lastUpdatedAt: null,
    assetStatusId: '',
    assetCategoryId: '',
    assetLocationId: '',
    notes: '',
    active: true,
    concurrencyStamp: '',
  });

  form = form(this.model, (schemaPath) => {
    disabled(schemaPath.inventoryCode);    
    maxLength(schemaPath.inventoryCode, 50, { message: 'Longitud máxima 50' });
    required(schemaPath.description, { message: 'Número de cuenta requerido' });
    required(schemaPath.brandId, { message: 'Marca requerida' });
    required(schemaPath.invoiceNumber, { message: 'Número Factura requerida' });
    maxLength(schemaPath.invoiceNumber, 50, { message: 'Longitud máxima 50' });
    min(schemaPath.price, 0.01, { message: 'Precio debe ser mayor a cero' });
    required(schemaPath.supplierId, { message: 'Proveedor requerido' });
    required(schemaPath.color, { message: 'Color requerido' });
    maxLength(schemaPath.color, 50, { message: 'Longitud máxima 50' });
    required(schemaPath.assetCategoryId, { message: 'Categoría requerida' });
    required(schemaPath.assetLocationId, { message: 'Ubicación requerida' });
    required(schemaPath.assetStatusId, { message: 'Estado requerido' });
    validate(schemaPath.fechaDescargo, ({ value }) => {
      if (!value() && this.selectedStatus()?.disposed) {
        return { kind: 'fechaDescargoRequerida', message: 'Fecha descargo es requerida' };
      }
      return null;
    });
    disabled(schemaPath.lastUpdatedAt);
  });

  formValid = computed(() => this.form().valid());
  isNew = computed(() => this.form().value().id === '');

  ngOnInit(): void {
    if (this.entityId()) {
      this.textLoading.set('Recuperando...');
      this.isLoading.set(true);
      this.api.get<AssetDTO>(`${urlAsset}/${this.entityId()}`).subscribe({
        next: (res) => {          
          res.purchaseDate = new Date(res.purchaseDate);
          if (res.lastUpdatedAt) res.lastUpdatedAt = new Date(res.lastUpdatedAt);
          if (res.fechaDescargo) res.fechaDescargo = new Date(res.fechaDescargo);
          this.model.set(res);
          this.isLoading.set(false);

          var st = this.assetService.statusList().find((f) => f.id === res.assetStatusId);
          if (st) this.selectedStatus.set(st);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  async onSubmit() {
    this.textLoading.set(this.isNew() ? 'Creando...' : 'Actualizando...');
    const ok = await submit(this.form, {
      action: async (raw) => {
        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<AssetDTO>(`${urlAsset}`, raw().value())
            : this.api.put<AssetDTO>(`${urlAsset}`, raw().value()),
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
