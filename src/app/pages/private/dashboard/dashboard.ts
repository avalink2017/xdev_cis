import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  BarController,
  DoughnutController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Card } from 'primeng/card';
import { UIChart } from 'primeng/chart';
import { PageLayout } from '../../../shared/components/page-layout/page-layout';
import { Icon } from '../../../shared/components/icon/icon';
import { DashboardService } from './dashboard.service';
import { DashboardKPI } from './dashboard.model.dto';

Chart.register(BarController, DoughnutController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const INGRESO_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#10b981'];
const EGRESO_COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#e11d48'];

/** Tono de acento por KPI: define icono, borde y color de texto en un solo lugar. */
type Tone = 'green' | 'red' | 'blue';

interface KpiCardConfig {
  label: string;
  icon: string;
  tone: Tone;
  value: number;
  sub?: string;
}

function currencyFormatter(value: string | number) {
  const n = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(n)) return '';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

@Component({
  selector: 'app-dashboard-page',
  imports: [PageLayout, Icon, Card, Button, Skeleton, Select, FormsModule, UIChart, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);

  data = this.dashboardService.data;
  loading = this.dashboardService.loading;

  currentYear = new Date().getFullYear();
  selectedYear = signal<number | undefined>(new Date().getFullYear());
  yearOptions = signal(
    Array.from({ length: 5 }, (_, i) => {
      const y = this.currentYear - i;
      return { label: String(y), value: y };
    }),
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.load(this.selectedYear());
  }

  /**
   * Arma las 6 tarjetas de KPI a partir de los datos crudos. El backend puede
   * devolver números como string (común con tipos decimales/BigDecimal), por
   * lo que cada valor se normaliza con Number(...) para evitar que el pipe de
   * moneda renderice $0 silenciosamente cuando el tipo no calza.
   */
  kpiCards = computed<KpiCardConfig[]>(() => {
    const k = this.data()?.kpis;
    const n = (v: unknown): number => {
      const num = Number(v);
      return Number.isFinite(num) ? num : 0;
    };
    const empty: DashboardKPI = {
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
    const d = k ?? empty;

    return [
      {
        label: 'Ingresos YTD',
        icon: 'LucideBanknoteArrowUp',
        tone: 'green',
        value: n(d.ingresosYTD),
        sub: `${n(d.cantidadIngresosYTD)} transacciones`,
      },
      {
        label: 'Egresos YTD',
        icon: 'LucideBanknoteArrowDown',
        tone: 'red',
        value: n(d.egresosYTD),
        sub: `${n(d.cantidadEgresosYTD)} transacciones`,
      },
      {
        label: 'Balance YTD',
        icon: 'LucideWalletMinimal',
        tone: n(d.balanceYTD) >= 0 ? 'blue' : 'red',
        value: n(d.balanceYTD),
      },
      {
        label: 'Ingresos del Mes',
        icon: 'LucideBanknoteArrowUp',
        tone: 'green',
        value: n(d.ingresosMesActual),
        sub: `${n(d.cantidadIngresosMes)} transacciones`,
      },
      {
        label: 'Egresos del Mes',
        icon: 'LucideBanknoteArrowDown',
        tone: 'red',
        value: n(d.egresosMesActual),
        sub: `${n(d.cantidadEgresosMes)} transacciones`,
      },
      {
        label: 'Balance del Mes',
        icon: 'LucideWalletMinimal',
        tone: n(d.balanceMesActual) >= 0 ? 'blue' : 'red',
        value: n(d.balanceMesActual),
      },
    ];
  });

  totalTransacciones = computed(() => {
    const k = this.data()?.kpis;
    return (Number(k?.cantidadIngresosYTD) || 0) + (Number(k?.cantidadEgresosYTD) || 0);
  });

  barData = computed(() => {
    // El backend no garantiza el orden; se ordena explícitamente por año/mes
    // para que el eje X siempre vaya de enero a diciembre del año seleccionado.
    const series = [...(this.data()?.monthlySeries ?? [])].sort(
      (a, b) => a.year - b.year || a.month - b.month,
    );
    return {
      labels: series.map((s) => s.label),
      datasets: [
        {
          label: 'Ingresos',
          data: series.map((s) => Number(s.ingresos) || 0),
          backgroundColor: '#22c55e',
          borderRadius: 4,
        },
        {
          label: 'Egresos',
          data: series.map((s) => Number(s.egresos) || 0),
          backgroundColor: '#ef4444',
          borderRadius: 4,
        },
      ],
    };
  });

  ingresoDonutData = computed(() => {
    const items = this.data()?.ingresosByType ?? [];
    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => Number(i.value) || 0),
          backgroundColor: INGRESO_COLORS.slice(0, items.length),
          borderWidth: 0,
        },
      ],
    };
  });

  egresoDonutData = computed(() => {
    const items = this.data()?.egresosByType ?? [];
    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => Number(i.value) || 0),
          backgroundColor: EGRESO_COLORS.slice(0, items.length),
          borderWidth: 0,
        },
      ],
    };
  });

  barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => '$' + ctx.parsed.y.toLocaleString('en-US'),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: currencyFormatter },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number; dataset: { data: number[] } }) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` ${ctx.label}: $${ctx.parsed.toLocaleString('en-US')} (${pct}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };
}
