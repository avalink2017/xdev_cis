export interface AssetStatusDTO {
  id: string;
  name: string;  
  concurrencyStamp: string;
}

export interface AssetStatusListDTO {
  id: string;
  name: string;
  severity:string;
}
