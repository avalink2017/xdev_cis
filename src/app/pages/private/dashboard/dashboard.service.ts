import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { DashboardKPI, DashboardResponseDTO } from './dashboard.model.dto';
import { MeterItem } from 'primeng/metergroup';
import { statusOperation } from '../../../core/model/shared.model.dto';

const EMPTY_KPIS: DashboardKPI = {
  ingresosYTD: 0,
  egresosYTD: 0,
  balanceYTD: 0,
  ingresosMesActual: 0,
  egresosMesActual: 0,
  balanceMesActual: 0,
  cantidadIngresosMes: 0,
  cantidadEgresosMes: 0,
  cantidadIngresosYTD: 0,
  cantidadEgresosYTD: 0,
};

const EMPTY_DATA: DashboardResponseDTO = {
  kpis: EMPTY_KPIS,
  monthlySeries: [],
  ingresosByType: [],
  egresosByType: [],
  statusCount:[]
};

export const MeterColors = ['#fbbf24', '#34d399', '#F43F5E'];

/** Convierte a número de forma segura; algunos backends serializan decimales como string. */
function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeKpis(kpis: Partial<DashboardKPI> | undefined): DashboardKPI {
  return {
    ingresosYTD: toNum(kpis?.ingresosYTD),
    egresosYTD: toNum(kpis?.egresosYTD),
    balanceYTD: toNum(kpis?.balanceYTD),
    ingresosMesActual: toNum(kpis?.ingresosMesActual),
    egresosMesActual: toNum(kpis?.egresosMesActual),
    balanceMesActual: toNum(kpis?.balanceMesActual),
    cantidadIngresosMes: toNum(kpis?.cantidadIngresosMes),
    cantidadEgresosMes: toNum(kpis?.cantidadEgresosMes),
    cantidadIngresosYTD: toNum(kpis?.cantidadIngresosYTD),
    cantidadEgresosYTD: toNum(kpis?.cantidadEgresosYTD),
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);
  private status = statusOperation

  data = signal<DashboardResponseDTO | undefined>(undefined);
  loading = signal(false);

  meterIncomes = signal<MeterItem[] | undefined>(undefined);
  countIncomes = signal<number>(0);
  meterExpenses = signal<MeterItem[] | undefined>(undefined);
  countExpenses = signal<number>(0);

  /**
   *
   */
  constructor() {
    effect(() => {
      if (this.data()) {
        this.buildIncomeStatusMeter();
        this.buildExpenseStatusMeter();
      };
    });
  }

  load(year?: number, cuentaBancoId?: string) {
    this.loading.set(true);
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (cuentaBancoId) params = params.set('cuentaBancoId', cuentaBancoId);

    this.api.get<DashboardResponseDTO>('dashboard', params).subscribe({
      next: (res) => {
        this.data.set({
          kpis: normalizeKpis(res?.kpis),
          monthlySeries: res?.monthlySeries ?? [],
          ingresosByType: res?.ingresosByType ?? [],
          egresosByType: res?.egresosByType ?? [],
          statusCount: res?.statusCount ?? [],
        });
        this.loading.set(false);
      },
      error: () => {
        this.data.set(EMPTY_DATA);
        this.loading.set(false);
      },
    });
  }

  buildIncomeStatusMeter() {
    const items: MeterItem[] = [];
    let cnt = 0;    
    this.data()?.statusCount.map((pos, idx) => {
      cnt += pos.yearlyIncomes;
      items.push({
        label: `${this.resolveStatusLabel(pos.statusName)}: ${pos.yearlyIncomes}`,
        color: MeterColors[idx],
        value: pos.yearlyIncomes,
      });
    });

    this.meterIncomes.set(items);
    this.countIncomes.set(cnt);
  }

  buildExpenseStatusMeter() {
    const items: MeterItem[] = [];
    let cnt = 0;    
    this.data()?.statusCount.map((pos, idx) => {
      cnt += pos.yearlyExpenses;
      items.push({
        label: `${this.resolveStatusLabel(pos.statusName)}: ${pos.yearlyExpenses}`,
        color: MeterColors[idx],
        value: pos.yearlyExpenses,
      });
    });

    this.meterExpenses.set(items);
    this.countExpenses.set(cnt);
  }

  resolveStatusLabel(id:string){
    const st = this.status.find(f => f.id == id)
    if(st)
      return st.label

    return '';
  }
}
