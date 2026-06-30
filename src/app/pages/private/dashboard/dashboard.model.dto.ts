export interface DashboardKPI {
  ingresosYTD: number;
  egresosYTD: number;
  balanceYTD: number;
  ingresosMesActual: number;
  egresosMesActual: number;
  balanceMesActual: number;
  cantidadIngresosMes: number;
  cantidadEgresosMes: number;
  cantidadIngresosYTD: number;
  cantidadEgresosYTD: number;
}

export interface MonthlySeriesDTO {
  year: number;
  month: number;
  label: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

export interface CategorySeriesDTO {
  label: string;
  value: number;
  percentage: number;
}

export interface DashboardResponseDTO {
  kpis: DashboardKPI;
  monthlySeries: MonthlySeriesDTO[];
  ingresosByType: CategorySeriesDTO[];
  egresosByType: CategorySeriesDTO[];
}
