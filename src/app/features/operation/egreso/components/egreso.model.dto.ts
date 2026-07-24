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
  status:string;
  hasObservation:boolean
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
  noCheque: string;
  fechaCheque: Date;
  monto: number;
  urlDocument: string;
  fileName: string;
  file: File | undefined;
  status: string;
  observacion:string;  
  concurrencyStamp: string;
}
