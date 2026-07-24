
export interface IngresoListDTO {
  id: number;
  numero: string;
  fechaMovimiento: Date;
  cuentaBancoId: string;
  cuentaBancoNumero: string;
  tipoIngresoId: string;
  tipoIngresoName: string;
  tipoDocumentoFinancieroId: string;
  tipoDocumentoFinancieroName: string;
  noDocumento: string;
  monto: number;
  status: string;
  hasObservation: boolean;
}

export interface IngresoDTO {
  id: number;
  numero: string;
  fechaMovimiento: Date;
  cuentaBancoId: string;
  tipoIngresoId: string;
  tipoDocumentoFinancieroId: string;
  partnerId: string;
  descripcion: string;
  noDocumento: string;
  monto: number;
  urlDocument: string;
  fileName: string;
  file: File | undefined;
  status: string;
  observacion: string;  
  concurrencyStamp: string;
}

