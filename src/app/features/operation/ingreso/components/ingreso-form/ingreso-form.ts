import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { IngresoDTO } from '../ingreso.model.dto';
import {
  form,
  required,
  submit,
  FormField,
  disabled,
  min,
  maxLength,
} from '@angular/forms/signals';
import {
  urlCuentaBanco,
  urlIngreso,
  urlPartner,
  urlTpoDocumento,
  urlTpoIngreso,
} from '../../../../../core/services/endpoint.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { InputNg } from '../../../../../shared/custom/input-ng/input-ng';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { TipoDocumentoListDTO } from '../../../../configuration/tipo-documento/components/tipo-documento.model.dto';
import { TipoIngresoListDTO } from '../../../../configuration/tipo-ingreso/components/tipo-ingreso.model.dto';
import { DatePickerNg } from '../../../../../shared/custom/date-picker-ng/date-picker-ng';
import { SelectNg } from '../../../../../shared/custom/select-ng/select-ng';
import { InputNumberNg } from '../../../../../shared/custom/input-number-ng/input-number-ng';
import { TextAreaNg } from '../../../../../shared/custom/text-area-ng/text-area-ng';
import { SearchAutocomplete } from '../../../../../shared/custom/search-autocomplete/search-autocomplete';
import { Panel } from 'primeng/panel';
import { PartnerDTO } from '../../../../partner/components/partner/partner.model.dto';
import { LoadingBlock } from '../../../../../shared/components/loading-block/loading-block';
import { Ingreso2FormData } from '../../../../../core/functions/Form2FormData';
import { statusOperation } from '../../../../../core/model/shared.model.dto';
import { StatusBarNg } from '../../../../../shared/custom/status-bar-ng/status-bar-ng';
import { DeviceService } from '../../../../../core/services/device.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-ingreso-form',
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
  templateUrl: './ingreso-form.html',
  styleUrl: './ingreso-form.css',
})
export class IngresoForm implements OnInit {
  inid = input<number | null>(null);

  private nt = inject(NotificationService);
  private api = inject(ApiService);
  private _confirm = inject(ConfirmationService);
  device = inject(DeviceService);

  DocFile = signal<File | null>(null);

  private model = signal<IngresoDTO>({
    id: 0,
    numero: '',
    fechaMovimiento: new Date(),
    cuentaBancoId: '',
    tipoIngresoId: '',
    tipoDocumentoFinancieroId: '',
    partnerId: '',
    descripcion: '',
    noDocumento: '',
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
    required(schemaPath.tipoIngresoId, { message: 'Tipo Ingreso requerido' });
    required(schemaPath.tipoDocumentoFinancieroId, { message: 'Tipo documento requerido' });
    required(schemaPath.partnerId, { message: 'Proveedor requerido' });
    required(schemaPath.descripcion, { message: 'Descripción requerida' });
    maxLength(schemaPath.descripcion, 500, { message: 'Longitud máxima 500' });
    maxLength(schemaPath.noDocumento, 50, { message: 'Longitud máxima 50' });
    disabled(schemaPath.numero);
    disabled(schemaPath, ({ valueOf }) => valueOf(schemaPath.status) !== 'draft');
    min(schemaPath.monto, 0.01, { message: 'El monto debe ser mayor a cero' });
  });

  isNew = computed(() => this.form().value().id === 0);
  isFormValid = computed(() => this.form().valid());
  statusId = computed(() => this.form().value().status);
  cuentasBanco = signal<CuentaBancoListDTO[]>([]);
  tipoDocumento = signal<TipoDocumentoListDTO[]>([]);
  tipoIngreso = signal<TipoIngresoListDTO[]>([]);

  selectedTI = computed(() => this.form().value().tipoIngresoId);
  urlSearch = computed(() =>
    this.selectedTI() === ''
      ? `${urlPartner}/search?rolecode=CU`
      : `${urlPartner}/search?rolecode=CU&tipoingreso=${this.selectedTI()}`,
  );
  urlEntity = `${urlPartner}/{id}`;
  partnerInfo = signal<PartnerDTO | undefined>(undefined);
  showLoader = signal(false);
  textLoader = signal<string>('Recuperando...');

  protected urlDocumentValue = computed(() => this.form().value().urlDocument);
  protected fileNameValue = computed(() => this.form().value().fileName);

  readonly status = statusOperation;

  ngOnInit(): void {
    forkJoin({
      ti: this.api.get<TipoIngresoListDTO[]>(`${urlTpoIngreso}/list`),
      cb: this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`),
      td: this.api.get<TipoDocumentoListDTO[]>(`${urlTpoDocumento}/list`),
    }).subscribe({
      next: ({ ti, cb, td }) => {
        this.tipoIngreso.set(ti);
        this.tipoDocumento.set(td);
        this.cuentasBanco.set(cb);

        if (!this.inid()) {
          this.model.update((m) => ({
            ...m,
            tipoIngresoId: ti.length > 0 ? ti[0].id : m.tipoIngresoId,
            cuentaBancoId: cb.length > 0 ? cb[0].id : m.cuentaBancoId,
            tipoDocumentoFinancieroId: td.length > 0 ? td[0].id : m.tipoDocumentoFinancieroId,
          }));
        }
      },
    });

    if (this.inid()) {
      this.showLoader.set(true);
      this.api.get<IngresoDTO>(`${urlIngreso}/${this.inid()}`).subscribe({
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
        const fd = Ingreso2FormData(raw().value());

        if (this.DocFile()) fd.append('file', this.DocFile() as File);

        const result = await firstValueFrom(
          this.isNew()
            ? this.api.post<IngresoDTO>(`${urlIngreso}`, fd)
            : this.api.put<IngresoDTO>(`${urlIngreso}`, fd),
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

  private patchModel(data: IngresoDTO) {
    data.fechaMovimiento = new Date(data.fechaMovimiento);
    this.model.set(data);
  }

  print() {
    this.showLoader.set(true);
    this.textLoader.set('Generando PDF...');

    this.api.getFile(`${urlIngreso}/print?id=${this.form().value().id}`).subscribe({
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

    this.api.downloadFile(`${urlIngreso}/print?id=${this.form().value().id}`).subscribe({
      next: () => this.showLoader.set(false),
      error: () => this.showLoader.set(false),
    });
  }

  confirm() {
    this._confirm.confirm({
      message: `¿Desea confirmar el Ingreso número ${this.form().value().numero ?? ''}?`,
      header: `Confirmar Ingreso`,
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
          .post<IngresoDTO>(`${urlIngreso}/confirm?id=${this.form().value().id}`, null)
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
      message: `¿Desea Anular el Ingreso número ${this.form().value().numero ?? ''}?`,
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
          .post<IngresoDTO>(`${urlIngreso}/cancel?id=${this.form().value().id}`, null)
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
