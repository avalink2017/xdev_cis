export interface CierreMesListDTO {
  id?: string;
  cuentaBancoId?: string;
  cuentaBancoNombre?: string;
  cuentaBancoNumero?: string;
  month: number;
  year: number;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoFinal: number;
  cerrado: boolean;
  fechaCierre?: string;
  fechaApertura?: string;
}

export interface CierreMesDTO {
  id?: string;
  cuentaBancoId?: string;
  month: number;
  year: number;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoFinal: number;
  cerrado: boolean;
  fechaCierre?: string;
  closedByUserId?: string;
  observacion?: string;
}
