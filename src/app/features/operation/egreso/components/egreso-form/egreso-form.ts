import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { TipoEgresoListDTO } from '../../../../configuration/tipo-egreso/components/tipo-egreso.model.dto';
import { urlCuentaBanco, urlEgreso, urlPartner, urlTpoDocumento, urlTpoEgreso } from '../../../../../core/services/endpoint.service';
import { disabled, form, FormField, min, required, submit } from '@angular/forms/signals';
import { forkJoin, firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { TipoDocumentoListDTO } from '../../../../configuration/tipo-documento/components/tipo-documento.model.dto';
import { PartnerDTO } from '../../../../partner/components/partner/partner.model.dto';
import { EgresoDTO } from '../egreso.model.dto';
import { Egreso2FormData } from '../../../../../core/functions/Form2FormData';
import { InputNg } from "../../../../../shared/custom/input-ng/input-ng";
import { DatePickerNg } from "../../../../../shared/custom/date-picker-ng/date-picker-ng";
import { Panel } from 'primeng/panel';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { FilePickerNg } from '../../../../../shared/custom/file-picker-ng/file-picker-ng';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';
import { SearchAutocomplete } from '../../../../../shared/custom/search-autocomplete/search-autocomplete';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { TextAreaNg } from '../../../../../shared/custom/text-area-ng/text-area-ng';

@Component({
  selector: 'app-egreso-form',
  imports: [
    InputNg,
    FormField,
    DatePickerNg,
    SelectNg,
    InputNumberNg,
    TextAreaNg,
    SearchAutocomplete,
    FilePickerNg,
    Panel,
    LoadingBlock,
  ],
  templateUrl: './egreso-form.html',
  styleUrl: './egreso-form.css',
})
export class EgresoForm implements OnInit {
  egid = input<number | null>(null);

  private nt = inject(NotificationService);
  private api = inject(ApiService);

  DocFile = signal<File | null>(null);

  private model = signal<EgresoDTO>({
    id: 0,
    numero: '',
    fechaMovimiento: new Date(),
    cuentaBancoId: '',
    tipoEgresoId: '',
    tipoDocumentoFinancieroId: '',
    partnerId: '',
    descripcion: '',
    noDocumento: '',
    noCheque: '',
    monto: 0,
    urlDocument: '',
    fileName: '',
    file: undefined,
    concurrencyStamp: '',
  });

  form = form(this.model, (schemaPath) => {
    required(schemaPath.fechaMovimiento, { message: 'Fecha requerida' });
    required(schemaPath.cuentaBancoId, { message: 'Cuenta de Banco requerida' });
    required(schemaPath.tipoEgresoId, { message: 'Tipo Egreso requerido' });
    required(schemaPath.tipoDocumentoFinancieroId, { message: 'Tipo documento requerido' });
    required(schemaPath.partnerId, { message: 'Proveedor requerido' });
    required(schemaPath.descripcion, { message: 'Descripción requerida' });
    required(schemaPath.noDocumento, { message: 'N°. Documento requerido' });
    required(schemaPath.noCheque, { message: 'N°. Cheque requerido' });
    disabled(schemaPath.numero);
    min(schemaPath.monto, 0.01, { message: 'El monto debe ser mayor a cero' });
  });

  isNew = computed(() => this.form().value().id === 0);
  isFormValid = computed(() => this.form().valid());
  cuentasBanco = signal<CuentaBancoListDTO[]>([]);
  tipoDocumento = signal<TipoDocumentoListDTO[]>([]);
  tipoEgreso = signal<TipoEgresoListDTO[]>([]);

  urlSearch = `${urlPartner}/search?rolecode=PR`;
  urlEntity = `${urlPartner}/{id}`;
  partnerInfo = signal<PartnerDTO | undefined>(undefined);
  showLoader = signal(false);

  protected urlDocumentValue = computed(() => this.form().value().urlDocument);
  protected fileNameValue = computed(() => this.form().value().fileName);

  ngOnInit(): void {
    forkJoin({
      te: this.api.get<TipoEgresoListDTO[]>(`${urlTpoEgreso}/list`),
      cb: this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`),
      td: this.api.get<TipoDocumentoListDTO[]>(`${urlTpoDocumento}/list`),
    }).subscribe({
      next: ({ te, cb, td }) => {
        this.tipoEgreso.set(te);
        this.tipoDocumento.set(td);
        this.cuentasBanco.set(cb);
      },
    });

    if (this.egid()) {
      this.showLoader.set(true);
      this.api.get<EgresoDTO>(`${urlEgreso}/${this.egid()}`).subscribe({
        next: (res) => {
          console.log(res)
          this.patchModel(res);
          this.showLoader.set(false);
        },
        error: () => this.showLoader.set(false),
      });
    }
  }

  async onSubmit() {
    const ok = await submit(this.form, {
      action: async (raw) => {
        const fd = Egreso2FormData(raw().value());

        if (this.DocFile()) fd.append('file', this.DocFile() as File);

        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<EgresoDTO>(`${urlEgreso}`, fd)
            : this.api.put<EgresoDTO>(`${urlEgreso}`, fd),
        );
        if (result) this.patchModel(result);

        return;
      },
    });

    if (ok) this.nt.showSuccess('Éxito', 'Registro guardado correctamente');
  }

  onPartnerChanged(pa: PartnerDTO) {
    this.partnerInfo.set(pa);
  }

  private patchModel(data: EgresoDTO) {
    data.fechaMovimiento = new Date(data.fechaMovimiento);
    this.model.set(data);
  }
}
