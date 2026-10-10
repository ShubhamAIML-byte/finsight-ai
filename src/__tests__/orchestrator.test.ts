import { describe, it, expect } from "vitest";
import { OrchestratorAgent } from "@/agents/orchestrator";
import { COMPANIES } from "@/data/companies";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { MACRO_INDICATORS, GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";
import { DOCUMENT_CHUNKS } from "@/data/documents";
import { RECOMMENDATIONS } from "@/data/recommendations";

describe("Orchestrator Agent Workflow Pipeline", () => {
  const orchestrator = new OrchestratorAgent();
  const testCompany = COMPANIES[0];
  const history = FINANCIAL_METRICS_BY_TICKER[testCompany.ticker];
  const latest = history[history.length - 1];

  it("executes all 7 agent stages in sequence and generates multilingual synthesis", async () => {
    const result = await orchestrator.runPipeline({
      query: "Analyze Apple profitability and tariff risks",
      language: "en",
      company: testCompany,
      financialHistory: history,
      latestFinancials: latest,
      macroIndicators: MACRO_INDICATORS,
      geopoliticalEvents: GEOPOLITICAL_EVENTS,
      retrievedChunks: DOCUMENT_CHUNKS,
      recommendations: RECOMMENDATIONS,
      apiKeyAvailable: false,
    });

    // Should complete all steps
    expect(result.steps.length).toBe(7);
    expect(result.steps.every((s) => s.status === "completed")).toBe(true);

    // Should have evidence sources
    expect(result.evidenceSources.length).toBeGreaterThan(0);

    // Synthesis should be populated
    expect(result.synthesis.answer).toBeTruthy();
    expect(result.synthesis.keyTakeaways.length).toBeGreaterThanOrEqual(3);
    expect(result.synthesis.recommendedActions.length).toBeGreaterThanOrEqual(2);
  });

  it("synthesizes accurate response in Hindi when requested", async () => {
    const result = await orchestrator.runPipeline({
      query: "ऐप्पल के वित्तीय प्रदर्शन का विश्लेषण करें",
      language: "hi",
      company: testCompany,
      financialHistory: history,
      latestFinancials: latest,
      macroIndicators: MACRO_INDICATORS,
      geopoliticalEvents: GEOPOLITICAL_EVENTS,
      retrievedChunks: DOCUMENT_CHUNKS,
      recommendations: RECOMMENDATIONS,
      apiKeyAvailable: false,
    });

    expect(result.synthesis.answer).toContain("वित्तीय विश्लेषण");
  });
});
