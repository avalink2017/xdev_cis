export interface AssetStatusDTO {
  id: string;
  name: string;  
  disposed:boolean;
  concurrencyStamp: string;
}

export interface AssetStatusListDTO {
  id: string;
  name: string;
  disposed: boolean;
  severity: string;
}
