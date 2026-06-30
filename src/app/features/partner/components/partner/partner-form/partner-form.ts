import { Component, computed, inject, input, output, signal } from '@angular/core';
import { PartnerService } from '../service/partner-service';
import { PartnerDTO } from '../partner.model.dto';
import { form, disabled, required, maxLength, FormField, FormRoot, minLength } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../../../core/model/api-response.model';
import { ApiService } from '../../../../../core/services/api.service';
import { urlPartner } from '../../../../../core/services/endpoint.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { Button } from 'primeng/button';
import { Icon } from '../../../../../shared/components/icon/icon';
import { ToggleButtonNg } from '../../../../../shared/custom/toggle-button-ng/toggle-button-ng';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { CountryService } from '../../../../../core/services/country.service';
import { TextAreaNg } from "../../../../../shared/custom/text-area-ng/text-area-ng";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from "primeng/message";

@Component({
  selector: 'app-partner-form',
  imports: [
    FormField,
    FormRoot,
    InputNg,
    Button,
    Icon,
    ToggleButtonNg,
    LoadingBlock,
    SelectNg,
    TextAreaNg,
    Tabs,
    TabList,
    Tab,
    MultiSelect,
    TabPanels,
    TabPanel,
    Message
],
  templateUrl: './partner-form.html',
  styleUrl: './partner-form.css',
})
export class PartnerForm {
  entityId = input<string | null>(null);
  formClose = output<boolean>();
  partnerService = inject(PartnerService);
  countryService = inject(CountryService);

  private api = inject(ApiService);
  private nt = inject(NotificationService);

  isNew = computed(() => !this.entityId());

  private model = signal<PartnerDTO>({
    id: '',
    code: '',
    name: '',
    tradeName: '',
    partnerTypeId: '',
    partnerCategoryId: '',
    email: '',
    phone: '',
    active: false,
    address: '',
    countryId: '',
    regionId: '',
    cityId: '',
    districtId: '',
    nit: '',
    nrc: '',
    dui: '',
    passport: '',
    roles: [] as string[],
    concurrencyStamp: '',
  });

  form = form(
    this.model,
    (schemaPath) => {
      disabled(schemaPath.code, ({ valueOf }) => valueOf(schemaPath.id) !== '');
      required(schemaPath.name, { message: 'Nombre requerido' });
      maxLength(schemaPath.name, 100, { message: 'Longitud máxima 100' });
      maxLength(schemaPath.tradeName, 100, { message: 'Longitud máxima 100' });
      required(schemaPath.partnerTypeId, { message: 'Tipo requerido' });
      required(schemaPath.partnerCategoryId, { message: 'Categoría requerida' });
      required(schemaPath.countryId, { message: 'País requerido' });
      required(schemaPath.regionId, { message: 'Región requerida' });
      required(schemaPath.cityId, { message: 'Ciudad requerida' });
      required(schemaPath.districtId, { message: 'Distrito requerido' });
      maxLength(schemaPath.tradeName, 100, { message: 'Longitud máxima 100' });
      maxLength(schemaPath.address, 300, { message: 'Longitud máxima 300' });
      minLength(schemaPath.roles, 1, { message: 'Debe seleccionar al menos un rol' });
    },
    {
      submission: {
        action: async (raw) => {
          const result = await firstValueFrom(
            this.isNew()
              ? this.api.post<ApiResponse<PartnerDTO>>(`${urlPartner}`, raw().value())
              : this.api.put<ApiResponse<PartnerDTO>>(`${urlPartner}`, raw().value()),
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
      this.api.get<PartnerDTO>(`${urlPartner}/${this.entityId()}`).subscribe({
        next: async (res) => {
          this.model.set(res);
          await this.countryService.initForEdit(
            res.countryId,
            res.regionId,
            res.cityId,
            res.districtId,
          );
        },
      });
  }
}
