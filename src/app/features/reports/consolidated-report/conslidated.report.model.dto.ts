interface ConsolidatedReportDTO {
  closed: boolean;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  lines: ConsolidatedLinesReportDTO[];
  summary: ConsolidatedSummaryReportDTO[];
}

interface ConsolidatedLinesReportDTO {
  tipo: string;
  concepto: string;
  monto: number;
}

interface ConsolidatedSummaryReportDTO {
  concepto?: string | null;
  monto: number;
}
