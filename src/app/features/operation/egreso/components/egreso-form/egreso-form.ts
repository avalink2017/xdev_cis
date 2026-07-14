import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { TipoEgresoListDTO } from '../../../../configuration/tipo-egreso/components/tipo-egreso.model.dto';
import {
  urlCuentaBanco,
  urlEgreso,
  urlPartner,
  urlTpoDocumento,
  urlTpoEgreso,
} from '../../../../../core/services/endpoint.service';
import {
  disabled,
  form,
  FormField,
  maxLength,
  min,
  required,
  submit,
} from '@angular/forms/signals';
import { forkJoin, firstValueFrom } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { TipoDocumentoListDTO } from '../../../../configuration/tipo-documento/components/tipo-documento.model.dto';
import { PartnerDTO } from '../../../../partner/components/partner/partner.model.dto';
import { EgresoDTO } from '../egreso.model.dto';
import { Egreso2FormData } from '../../../../../core/functions/Form2FormData';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { DatePickerNg } from '../../../../../shared/custom/date-picker-ng/date-picker-ng';
import { Panel } from 'primeng/panel';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';
import { SearchAutocomplete } from '../../../../../shared/custom/search-autocomplete/search-autocomplete';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { TextAreaNg } from '../../../../../shared/custom/text-area-ng/text-area-ng';
import { StatusBarNg } from '../../../../../shared/custom/status-bar-ng/status-bar-ng';
import { statusOperation } from '../../../../../core/model/shared.model.dto';
import { DeviceService } from '../../../../../core/services/device.service';
import { ConfirmationService } from 'primeng/api';

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
    Panel,
    LoadingBlock,
    StatusBarNg,
  ],
  templateUrl: './egreso-form.html',
  styleUrl: './egreso-form.css',
})
export class EgresoForm implements OnInit {
  egid = input<number | null>(null);

  private nt = inject(NotificationService);
  private api = inject(ApiService);
  private _confirm = inject(ConfirmationService);
  device = inject(DeviceService);

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
    status: 'draft',
    concurrencyStamp: '',
  });

  form = form(this.model, (schemaPath) => {
    required(schemaPath.fechaMovimiento, { message: 'Fecha requerida' });
    required(schemaPath.cuentaBancoId, { message: 'Cuenta de Banco requerida' });
    required(schemaPath.tipoEgresoId, { message: 'Tipo Egreso requerido' });
    required(schemaPath.tipoDocumentoFinancieroId, { message: 'Tipo documento requerido' });
    required(schemaPath.partnerId, { message: 'Proveedor requerido' });
    required(schemaPath.descripcion, { message: 'Descripción requerida' });
    maxLength(schemaPath.descripcion, 500, { message: 'Longitud máxima 500' });
    required(schemaPath.noDocumento, { message: 'N°. Factura requerida' });
    maxLength(schemaPath.noDocumento, 50, { message: 'Longitud máxima 50' });
    required(schemaPath.noCheque, { message: 'N°. Cheque requerido' });
    maxLength(schemaPath.noCheque, 20, { message: 'Longitud máxima 20' });
    disabled(schemaPath.numero);
    disabled(schemaPath, ({ valueOf }) => valueOf(schemaPath.status) !== 'draft');
    min(schemaPath.monto, 0.01, { message: 'El monto debe ser mayor a cero' });
  });

  isNew = computed(() => this.form().value().id === 0);
  isFormValid = computed(() => this.form().valid());
  cuentasBanco = signal<CuentaBancoListDTO[]>([]);
  statusId = computed(() => this.form().value().status);
  tipoDocumento = signal<TipoDocumentoListDTO[]>([]);
  tipoEgreso = signal<TipoEgresoListDTO[]>([]);

  urlSearch = `${urlPartner}/search?rolecode=PR`;
  urlEntity = `${urlPartner}/{id}`;
  partnerInfo = signal<PartnerDTO | undefined>(undefined);
  showLoader = signal(false);
  textLoader = signal<string>('Recuperando...');

  protected urlDocumentValue = computed(() => this.form().value().urlDocument);
  protected fileNameValue = computed(() => this.form().value().fileName);

  readonly status = statusOperation;

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

        const typdoc = td.find((f) => f.id === '06bafaf9-30f4-484c-9401-cd1788935b55');

        if (!this.egid())
          this.model.update((m) => ({
            ...m,
            cuentaBancoId: cb.length > 0 ? cb[0].id : m.cuentaBancoId,
            tipoEgresoId: te.length > 0 ? te[0].id : m.tipoEgresoId,
            tipoDocumentoFinancieroId: typdoc ? typdoc.id : m.tipoDocumentoFinancieroId,
          }));
      },
    });

    if (this.egid()) {
      this.showLoader.set(true);
      this.api.get<EgresoDTO>(`${urlEgreso}/${this.egid()}`).subscribe({
        next: (res) => {
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
        this.textLoader.set('Guardando...');
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

  print() {
    this.showLoader.set(true);
    this.textLoader.set('Generando PDF...');

    this.api.getFile(`${urlEgreso}/print?id=${this.form().value().id}`).subscribe({
      next: ({ blob }) => {
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
        this.showLoader.set(false);
      },
      error: () => this.showLoader.set(false),
    });
  }

  download() {
    this.showLoader.set(true);
    this.textLoader.set('Descargando PDF...');

    this.api.downloadFile(`${urlEgreso}/print?id=${this.form().value().id}`).subscribe({
      next: () => this.showLoader.set(false),
      error: () => this.showLoader.set(false),
    });
  }

  confirm() {
    this._confirm.confirm({
      message: `¿Desea confirmar el Egreso número ${this.form().value().numero ?? ''}?`,
      header: `Confirmar Egreso`,
      closable: true,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'contrast',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: '¡Si, Confirmar!',
        size: 'small',
        styleClass: 'ml-2!',
        severity: 'danger',
      },
      accept: () => {
        this.showLoader.set(true);
        this.textLoader.set('Confirmando...');

        this.api
          .post<EgresoDTO>(`${urlEgreso}/confirm?id=${this.form().value().id}`, null)
          .subscribe({
            next: (res) => {
              this.showLoader.set(false);
              this.patchModel(res);
            },
            error: () => this.showLoader.set(false),
          });
      },
    });
  }

  cancel() {
    this._confirm.confirm({
      message: `¿Desea Anular el Egreso número ${this.form().value().numero ?? ''}?`,
      header: `Anular Ingreso`,
      closable: true,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'contrast',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: '¡Si, Anular!',
        size: 'small',
        styleClass: 'ml-2!',
        severity: 'danger',
      },
      accept: () => {
        this.showLoader.set(true);
        this.textLoader.set('Anulando...');

        this.api
          .post<EgresoDTO>(`${urlEgreso}/cancel?id=${this.form().value().id}`, null)
          .subscribe({
            next: (res) => {
              this.showLoader.set(false);
              this.patchModel(res);
            },
            error: () => this.showLoader.set(false),
          });
      },
    });
  }
}
