import { Component, inject, OnInit, signal } from '@angular/core';
import { PageLayout } from "../../../shared/components/page-layout/page-layout";
import { Card } from "primeng/card";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { LoadingBlock } from "../../../shared/components/loading-block/loading-block";
import { CuentaBancoListDTO } from '../../configuration/bank-account/components/bank-account.model.dto';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { ApiService } from '../../../core/services/api.service';
import { urlCuentaBanco, urlReportOperationDetail } from '../../../core/services/endpoint.service';
import { DetailOperationsListDTO } from './detail.report.model.dto';
import { TableModule } from "primeng/table";
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details-report',
  imports: [
    PageLayout,
    Card,
    Select,
    Button,
    LoadingBlock,
    FormsModule,
    DatePicker,
    TableModule,
    DatePipe,
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './details-report.html',
  styleUrl: './details-report.css',
})
export class DetailsReport implements OnInit {
  private api = inject(ApiService);
  showLoader = signal(false);
  private month = signal<string>(String(new Date().getMonth() + 1));
  private year = signal<number>(new Date().getFullYear());
  fecha_base = signal<Date>(new Date());
  account = signal<string>('');
  cuentas = signal<CuentaBancoListDTO[]>([]);
  tipoReport = signal<string>('in');
  data = signal<DetailOperationsListDTO[] | undefined>(undefined);

  operaciones = [
    { id: 'in', label: 'Ingresos' },
    { id: 'out', label: 'Egresos' },
  ];

  ngOnInit(): void {
    this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`).subscribe({
      next: (res) => {
        this.cuentas.set(res);
        if (res.length > 0) this.account.set(res[0].id);
      },
    });
  }

  calculateSubTotal(tipo: string) {
    let total = 0;

    if (this.data()) {
      total = this.data()?.filter(f => f.tipo === tipo).reduce((acc,p) => acc + p.importe,0) ?? 0
    }

    return total;
  }

  GenerateReport() {
    this.showLoader.set(true);
    this.api
      .get<
        DetailOperationsListDTO[]
      >(`${urlReportOperationDetail}/detail?tipo=${this.tipoReport()}&accountid=${this.account()}&month=${this.month()}&year=${this.year()}`)
      .subscribe({
        next: (res) => {
          this.data.set(res);
          this.showLoader.set(false);
        },
        error: () => this.showLoader.set(false),
      });
  }

  PrintReport() {}
}
