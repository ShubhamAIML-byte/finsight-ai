import { SupportedLanguage } from "@/types/chat";
import { Company, FinancialMetric } from "@/types/financial";
import { GeopoliticalEvent, MacroIndicator } from "@/types/intelligence";
import { DocumentChunk } from "@/types/document";
import { Recommendation } from "@/types/recommendation";
import { ExplainabilityModelOverview } from "@/types/explainability";

export interface AgentContext {
  query: string;
  language: SupportedLanguage;
  company: Company;
  financialHistory: FinancialMetric[];
  latestFinancials: FinancialMetric;
  priorFinancials?: FinancialMetric;
  macroIndicators: MacroIndicator[];
  geopoliticalEvents: GeopoliticalEvent[];
  retrievedChunks: DocumentChunk[];
  recommendations: Recommendation[];
  explainability?: ExplainabilityModelOverview;
  apiKeyAvailable: boolean;
}

export interface AgentOutput<T = unknown> {
  agentRole: string;
  agentName: string;
  success: boolean;
  durationMs: number;
  data: T;
  summary: string;
  confidence: number; // 0.0 - 1.0
  error?: string;
}
