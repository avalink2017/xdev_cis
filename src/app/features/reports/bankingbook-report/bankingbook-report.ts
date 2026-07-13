import { Component, inject, OnInit, signal } from '@angular/core';
import { Months } from '../../../core/model/shared.model.dto';
import { ApiService } from '../../../core/services/api.service';
import { CuentaBancoListDTO } from '../../configuration/bank-account/components/bank-account.model.dto';
import { urlCuentaBanco, urlReports } from '../../../core/services/endpoint.service';
import { PageLayout } from "../../../shared/components/page-layout/page-layout";
import { Card } from "primeng/card";
import { Select } from "primeng/select";
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { LoadingBlock } from "../../../shared/components/loading-block/loading-block";
import { Message } from "primeng/message";
import { InputNumber } from 'primeng/inputnumber';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bankingbook-report',
  imports: [
    PageLayout,
    Card,
    Select,
    FormsModule,
    DatePipe,
    DecimalPipe,
    Button,
    TableModule,
    LoadingBlock,
    Message,
    InputNumber,
    RouterLink
  ],
  templateUrl: './bankingbook-report.html',
  styleUrl: './bankingbook-report.css',
})
export class BankingbookReport implements OnInit {
  private api = inject(ApiService);

  months = Months;
  showLoader = signal(false);
  month = signal<string>(String(new Date().getMonth() + 1));
  year = signal<number>(new Date().getFullYear());
  account = signal<string>('');
  cuentas = signal<CuentaBancoListDTO[]>([]);
  data = signal<BankingBookDTO | undefined>(undefined);

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
      .get<BankingBookDTO>(
        `${urlReports}/bankingbook?accountid=${this.account()}&month=${this.month()}&year=${this.year()}`,
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
        `${urlReports}/bankingbook/pdf?accountid=${this.account()}&month=${this.month()}&year=${this.year()}`,
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
}
