export interface NumberRangeDTO {
  id: string;
  name: string;
  numStart: number;
  numEnd: number;
  numCurrent: number;
  prefix: string;
  active: boolean;
  concurrencyStamp: string;
}

export interface NumberRangeListDTO {
  id: string;
  name: string;
  numStart: number;
  numEnd: number;
  numCurrent: number;
  prefix: string;
  active: boolean;
}
