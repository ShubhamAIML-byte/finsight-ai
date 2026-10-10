import { AgentContext, AgentOutput } from "./types";
import { GeopoliticalEvent } from "@/types/intelligence";

export interface GeopoliticalRiskData {
  relevantEventCount: number;
  overallThreatScore: number; // 0-100
  criticalEvents: GeopoliticalEvent[];
  supplyChainVulnerability: string;
  tariffVulnerability: string;
  complianceMandates: string[];
}

export class GeopoliticalRiskAgent {
  public readonly name = "Geopolitical Risk Agent";
  public readonly role = "geopolitical_risk";

  public async analyze(context: AgentContext): Promise<AgentOutput<GeopoliticalRiskData>> {
    const startTime = Date.now();
    const { geopoliticalEvents, company } = context;

    const relevant = geopoliticalEvents.filter(
      (e) => e.relatedCompanies.includes(company.ticker) || e.relatedIndustries.includes(company.industry) || e.relatedIndustries.includes(company.sector)
    );

    const critical = relevant.filter((e) => e.severity === "critical" || e.severity === "high");

    const overallThreatScore = Math.min(100, Math.round(relevant.length * 18 + critical.length * 15));

    const complianceMandates = relevant.map((e) => `${e.category.toUpperCase()}: ${e.headline}`);

    return {
      agentRole: this.role,
      agentName: this.name,
      success: true,
      durationMs: Date.now() - startTime,
      data: {
        relevantEventCount: relevant.length,
        overallThreatScore,
        criticalEvents: critical,
        supplyChainVulnerability: critical.some((e) => e.category === "supply_chain") ? "Elevated" : "Moderate",
        tariffVulnerability: critical.some((e) => e.category === "tariff" || e.category === "trade_policy") ? "High" : "Low",
        complianceMandates,
      },
      summary: `Identified ${relevant.length} relevant geopolitical events for ${company.ticker} (${critical.length} high/critical). Overall geopolitical risk index: ${overallThreatScore}/100.`,
      confidence: 0.92,
    };
  }
}
