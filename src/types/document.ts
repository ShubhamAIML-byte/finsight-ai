export type DocumentType =
  | "annual_report_10k"
  | "quarterly_report_10q"
  | "earnings_transcript"
  | "investor_deck"
  | "geopolitical_memo"
  | "economic_bulletin"
  | "financial_statement_csv";

export type IngestionStatus = "indexed" | "processing" | "failed" | "pending";

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  metadata: {
    pageNumber?: number;
    sectionHeading?: string;
    reportingPeriod?: string;
    companyTicker?: string;
  };
  embeddingPreview?: number[]; // truncated vector preview
  similarityScore?: number;
}

export interface IngestedDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: "pdf" | "csv" | "txt";
  documentType: DocumentType;
  companyTicker?: string;
  reportingPeriod?: string;
  publicationDate: string;
  status: IngestionStatus;
  chunkCount: number;
  verifiedSource: boolean;
  uploadedAt: string;
  summary: string;
}
