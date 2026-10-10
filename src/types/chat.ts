import { AgentExecutionStep } from "./agent";

export type SupportedLanguage = "en" | "hi" | "bn" | "es" | "fr";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  welcomeGreeting: string;
}

export interface ChatCitation {
  id: string;
  title: string;
  sourceType: string;
  page?: number;
  period?: string;
  snippet: string;
  relevancePercent: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  detectedLanguage?: SupportedLanguage;
  companyContext?: string; // ticker e.g. "AAPL"
  timestamp: string;
  citations?: ChatCitation[];
  agentExecutionSteps?: AgentExecutionStep[];
  isThinking?: boolean;
  isStreaming?: boolean;
  calculationBreakdown?: {
    metric: string;
    formula: string;
    inputs: Record<string, number | string>;
    result: number | string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  language: SupportedLanguage;
  companyTicker: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
