export interface EgresoListDTO {
  id: number;
  numero: string;
  fechaMovimiento: Date;
  cuentaBancoId: string;
  cuentaBancoNumero: string;
  tipoEgresoId: string;
  tipoEgresoName: string;
  tipoDocumentoFinancieroId: string;
  tipoDocumentoFinancieroName: string;
  noDocumento: string;
  noCheque: string;
  monto: number;
}

export interface EgresoDTO {
  id: number;
  numero: string;
  fechaMovimiento: Date;
  cuentaBancoId: string;
  tipoEgresoId: string;
  tipoDocumentoFinancieroId: string;
  partnerId: string;
  descripcion: string;
  noDocumento: string;
  noCheque:string;
  monto: number;
  urlDocument: string;
  fileName: string;
  file: File | undefined;
  concurrencyStamp: string;
}
