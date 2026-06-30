export enum TipoCuenta {
  Ahorros = 1,
  Corriente = 2,
}

export interface CuentaBancoListDTO {
  id: string;
  nombre: string;
  numeroCuenta: string;
  bancoId: string;
  bancoNombre: string;
  tipoCuenta: TipoCuenta;
  fechaApertura: Date;
  active: boolean;
}

export const TIPO_CUENTA_OPTIONS = [
  { label: 'Ahorro', value: 'Ahorro' },
  { label: 'Corriente', value: 'Corriente' },
];

export interface CuentaBancoDTO {
  id: string;
  nombre: string;
  numeroCuenta: string;
  bancoId: string;
  tipoCuenta: string;
  fechaApertura: Date;
  saldoInicial: number;
  active: boolean;
  concurrencyStamp: string;
}
