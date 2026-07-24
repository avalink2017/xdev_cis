import { Component, inject, model, OnInit, signal } from '@angular/core';
import { urlCuentaBanco, urlIngreso, urlTpoDocumento, urlTpoIngreso } from '../../../../../core/services/endpoint.service';
import { IngresoListDTO } from '../ingreso.model.dto';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../../core/services/api.service';
import { rowData, TableView } from '../../../../../shared/components/table/table-view/table-view';
import { TableColumn } from "../../../../../shared/components/table/table-column/table-column";
import { DatePicker } from "primeng/datepicker";
import { FormsModule } from '@angular/forms';
import { CuentaBancoListDTO } from '../../../../configuration/bank-account/components/bank-account.model.dto';
import { TipoDocumentoListDTO } from '../../../../configuration/tipo-documento/components/tipo-documento.model.dto';
import { TipoIngresoListDTO } from '../../../../configuration/tipo-ingreso/components/tipo-ingreso.model.dto';
import { forkJoin } from 'rxjs';
import { Select } from 'primeng/select';
import { Router } from '@angular/router';
import { Tag } from "primeng/tag";
import { FilterObservation, severityNG, statusOperation } from '../../../../../core/model/shared.model.dto';

@Component({
  selector: 'app-ingreso-list',
  imports: [TableView, TableColumn, DatePicker, FormsModule, Select, Tag],
  templateUrl: './ingreso-list.html',
  styleUrl: './ingreso-list.css',
})
export class IngresoList implements OnInit {
  refresh = model<boolean>(false);
  private confirm = inject(ConfirmationService);
  private api = inject(ApiService);  
  private router = inject(Router)

  url = `${urlIngreso}/paged`;

  cuentasBanco = signal<CuentaBancoListDTO[]>([])
  tipoDocumento = signal<TipoDocumentoListDTO[]>([])
  tipoIngreso = signal<TipoIngresoListDTO[]>([])

  status = statusOperation;
  observationFilter = FilterObservation;

  ngOnInit(): void {
    forkJoin({
      ti: this.api.get<TipoIngresoListDTO[]>(`${urlTpoIngreso}/list`),
      cb: this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`),
      td: this.api.get<TipoDocumentoListDTO[]>(`${urlTpoDocumento}/list`),
    }).subscribe({next:({ti,cb,td}) => {
      this.tipoIngreso.set(ti)
      this.tipoDocumento.set(td)
      this.cuentasBanco.set(cb)
    }});
  }

  onRowClick(row: rowData<IngresoListDTO>) {
    this.router.navigate(['/app/operation/ingreso/edit',row.id]);
  }

  onAddNew() {
    this.router.navigate(['/app/operation/ingreso/create'])
  }

  onDelete(row: IngresoListDTO) {
    this.confirm.confirm({
      message: `¿Desea eliminar el Ingreso número ${row.numero ?? ''}?`,
      header: `Eliminar Ingreso`,
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
        this.api.delete(`${urlIngreso}`, [row.id]).subscribe({
          next: () => this.refresh.set(true),
        });
      },
    });
  }  

  resolveTagValue(val:string){
      const rec = this.status.find(f => f.id === val)
      if(rec)
      return rec.label
  
      return '';
    }
  
    resolveStatusSeverity(val: string): typeof severityNG {
      switch (val) {
        case 'draft':
          return 'warn';
        case 'confirmed':
          return 'success';
        case 'canceled':
          return 'danger';
        default:
          return 'secondary';
      }
    }
}
