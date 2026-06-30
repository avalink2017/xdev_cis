import { Component, inject, model, OnInit, signal } from '@angular/core';
import { urlCuentaBanco, urlEgreso, urlTpoDocumento, urlTpoEgreso } from '../../../../../core/services/endpoint.service';
import { TipoEgresoListDTO } from '../../../../configuration/tipo-egreso/components/tipo-egreso.model.dto';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { TipoDocumentoListDTO } from '../../../../configuration/tipo-documento/components/tipo-documento.model.dto';
import { EgresoListDTO } from '../egreso.model.dto';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { DatePicker } from "primeng/datepicker";
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-egreso-list',
  imports: [TableView, TableColumn, DatePicker, Select, FormsModule],
  templateUrl: './egreso-list.html',
  styleUrl: './egreso-list.css',
})
export class EgresoList implements OnInit {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);
  private router = inject(Router);

  url = `${urlEgreso}/paged`;

  cuentasBanco = signal<CuentaBancoListDTO[]>([]);
  tipoDocumento = signal<TipoDocumentoListDTO[]>([]);
  tipoEgreso = signal<TipoEgresoListDTO[]>([]);

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
  }

  onRowClick(row: rowData<EgresoListDTO>) {
    this.router.navigate(['/app/operation/egreso/edit', row.id]);
  }

  onAddNew() {
    this.router.navigate(['/app/operation/egreso/create']);
  }

  onDelete(row: EgresoListDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Egreso número ${row.numero ?? ''}?`,
      header: `Eliminar Egreso`,
      closable: true,
      closeOnEscape: false,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'contrast',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: '¡Si, Eliminar!',
        size: 'small',
        styleClass: 'ml-2!',
        severity: 'danger',
      },
      accept: () => {
        this.api.delete(`${urlEgreso}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }
}
