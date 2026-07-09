export interface TipoIngresoDTO {
  id: string;
  code: string;
  name: string;
  partnerCategoryId:string;  
  concurrencyStamp: string;
}

export interface TipoIngresoListDTO {
  id: string;
  code: string;
  name: string;
}
