import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { UIChart } from 'primeng/chart';
import { ApiService } from '../../../core/services/api.service';
import { PageLayout } from '../../../shared/components/page-layout/page-layout';
import { Card } from 'primeng/card';
import { Months } from '../../../core/model/shared.model.dto';
import { CuentaBancoListDTO } from '../../configuration/bank-account/components/bank-account.model.dto';
import {
  urlCuentaBanco,
  urlReportOperationConsolidated,
} from '../../../core/services/endpoint.service';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { LoadingBlock } from '../../../shared/components/loading-block/loading-block';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { DecimalPipe } from '@angular/common';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-consolidated-report',
  imports: [
    PageLayout,
    Card,
    Select,
    FormsModule,
    InputNumber,
    Button,
    LoadingBlock,
    Message,
    TableModule,
    DecimalPipe,
    UIChart,
  ],
  templateUrl: './consolidated-report.html',
  styleUrl: './consolidated-report.css',
})
export class ConsolidatedReport implements OnInit {
  private api = inject(ApiService);

  months = Months;
  showLoader = signal(false);
  month = signal<string>(String(new Date().getMonth() + 1));
  year = signal<number>(new Date().getFullYear());
  account = signal<string>('');
  cuentas = signal<CuentaBancoListDTO[]>([]);
  data = signal<ConsolidatedReportDTO | undefined>(undefined);

  chartData = computed(() => {
    const s = this.data()?.summary?.filter((x) => x.concepto && !/^saldo/i.test(x.concepto));
    if (!s || s.length === 0) return null;
    return {
      labels: s.map((x) => x.concepto),
      datasets: [
        {
          data: s.map((x) => x.monto),
          backgroundColor: ['#22c55e', '#ef4444'],
          hoverBackgroundColor: ['#16a34a', '#dc2626'],
        },
      ],
    };
  });

  ngOnInit(): void {
    this.api.get<CuentaBancoListDTO[]>(`${urlCuentaBanco}/list`).subscribe({
      next: (res) => {
        this.cuentas.set(res);
        if (res.length > 0) this.account.set(res[0].id);
      },
    });
  }

  GenerateReport() {
    this.showLoader.set(true);
    this.api
      .get<ConsolidatedReportDTO>(
        `${urlReportOperationConsolidated}/consolidado?accountid=${this.account()}&month=${this.month()}&year=${this.year()}`,
      )
      .subscribe({
        next: (res) => {
          this.data.set(res);
          this.showLoader.set(false);
        },
        error: () => this.showLoader.set(false),
      });
  }

  PrintReport() {
    this.showLoader.set(true);
    this.api
      .getFile(
        `${urlReportOperationConsolidated}/consolidado/pdf?accountid=${this.account()}&month=${this.month()}&year=${this.year()}`,
      )
      .subscribe({
        next: ({ blob }) => {
          const pdfUrl = URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
          this.showLoader.set(false);
        },
        error: () => this.showLoader.set(false),
      });
  }

  calculateSubTotal(tipo: string) {
    let total = 0;

    if (this.data() && this.data()?.lines) {
      for (let line of this.data()?.lines!) {
        if (line.tipo === tipo) total += line.monto;
      }
    }

    return total;
  }

  getSaldo(idx: number) {
    return this.data()?.summary?.[idx]?.monto ?? 0;
  }
}
