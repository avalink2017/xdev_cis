interface BankingBookDTO {
  bankAccountNumber?: string | null;
  bankName?: string | null;
  saldoInical: number;
  saldoFinal: number;
  lines: BankingBookLinesDTO[];
}

interface BankingBookLinesDTO {
  fecha: Date; // DateTimeOffset -> ISO 8601 string
  transaction: string;
  concepto: string;
  reference: string;
  noCheque:string;
  debito: number;
  credito: number;
  saldo: number;
  tipo:string;
  id:number;
}
