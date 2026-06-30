export interface TipoDocumentoDTO {
  id: string;
  code: string;
  name: string;
  active: boolean;
  concurrencyStamp: string;
}

export interface TipoDocumentoListDTO {
  id: string;
  code: string;
  name: string;
}
