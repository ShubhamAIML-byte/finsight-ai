export type AgentRole =
  | "orchestrator"
  | "financial_analysis"
  | "economic_intelligence"
  | "geopolitical_risk"
  | "industry_intelligence"
  | "forecasting"
  | "recommendation"
  | "explainability";

export type AgentStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface AgentExecutionStep {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  status: AgentStepStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  inputSummary: string;
  outputSummary?: string;
  dataPayload?: Record<string, unknown>;
  confidence?: number;
  error?: string;
}

export interface OrchestrationPipelineResult {
  query: string;
  targetCompanyTicker: string;
  steps: AgentExecutionStep[];
  totalDurationMs: number;
  synthesis: {
    answer: string;
    keyTakeaways: string[];
    riskAssessment: string;
    recommendedActions: string[];
  };
  evidenceSources: {
    title: string;
    snippet: string;
    source: string;
  }[];
  timestamp: string;
}
