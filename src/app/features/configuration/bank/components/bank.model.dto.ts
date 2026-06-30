export interface BankDTO {
  id: string;
  code: string;
  name: string;
  active:boolean;
  concurrencyStamp: string;
}

export interface BankListDTO {
  id: string;
  code: string;
  name: string;
}
