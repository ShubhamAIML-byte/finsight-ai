import { AgentContext, AgentOutput } from "./types";
import { calculateAltmanZScore, calculatePiotroskiFScore } from "@/lib/financial-math";

export interface FinancialAnalysisData {
  revenueGrowthYoY: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  roe: number;
  roa: number;
  fcfConversion: number;
  debtToEquity: number;
  currentRatio: number;
  altmanZ: { score: number; zone: string; interpretation: string };
  piotroski: { score: number; criteria: { name: string; pass: boolean }[] };
  keyObservations: string[];
}

export class FinancialAnalysisAgent {
  public readonly name = "Financial Analysis Agent";
  public readonly role = "financial_analysis";

  public async analyze(context: AgentContext): Promise<AgentOutput<FinancialAnalysisData>> {
    const startTime = Date.now();
    const { latestFinancials, priorFinancials, company } = context;

    const priorRev = priorFinancials ? priorFinancials.revenue : latestFinancials.revenue;
    const revenueGrowthYoY = Number((((latestFinancials.revenue - priorRev) / priorRev) * 100).toFixed(2));
    const fcfConversion = Number(((latestFinancials.freeCashFlow / latestFinancials.revenue) * 100).toFixed(2));

    const altmanZ = calculateAltmanZScore(latestFinancials, company.marketCap);
    const piotroski = calculatePiotroskiFScore(latestFinancials, priorFinancials);

    const keyObservations: string[] = [
      `Revenue reached $${latestFinancials.revenue}B (${revenueGrowthYoY > 0 ? "+" : ""}${revenueGrowthYoY}% YoY).`,
      `Operating Margin sits at ${latestFinancials.operatingMargin}% with Gross Margin at ${latestFinancials.grossMargin}%.`,
      `Free Cash Flow generated: $${latestFinancials.freeCashFlow}B (conversion rate of ${fcfConversion}% of sales).`,
      `Solvency profile: Altman Z-Score of ${altmanZ.score} (${altmanZ.zone.toUpperCase()} zone), Piotroski F-Score: ${piotroski.score}/9.`,
    ];

    return {
      agentRole: this.role,
      agentName: this.name,
      success: true,
      durationMs: Date.now() - startTime,
      data: {
        revenueGrowthYoY,
        grossMargin: latestFinancials.grossMargin,
        operatingMargin: latestFinancials.operatingMargin,
        netMargin: latestFinancials.netMargin,
        roe: latestFinancials.roe,
        roa: latestFinancials.roa,
        fcfConversion,
        debtToEquity: latestFinancials.debtToEquity,
        currentRatio: latestFinancials.currentRatio,
        altmanZ,
        piotroski,
        keyObservations,
      },
      summary: `Analyzed 5-year financials: Revenue growth is ${revenueGrowthYoY}%, Operating Margin is ${latestFinancials.operatingMargin}%, Health Score is ${company.healthScore}/100.`,
      confidence: 0.98,
    };
  }
}
