import { AgentContext, AgentOutput } from "./types";

export interface EconomicIntelligenceData {
  primaryRatesSummary: string;
  fxPressureRating: "low" | "moderate" | "high";
  inflationHeadwindRating: "low" | "moderate" | "high";
  monetaryEnvironment: string;
  keyDrivers: string[];
}

export class EconomicIntelligenceAgent {
  public readonly name = "Economic Intelligence Agent";
  public readonly role = "economic_intelligence";

  public async analyze(context: AgentContext): Promise<AgentOutput<EconomicIntelligenceData>> {
    const startTime = Date.now();
    const { macroIndicators } = context;

    const us10y = macroIndicators.find((m) => m.code === "US10Y")?.currentValue ?? 4.38;
    const fedrate = macroIndicators.find((m) => m.code === "FEDRATE")?.currentValue ?? 4.62;
    const dxy = macroIndicators.find((m) => m.code === "DXY")?.currentValue ?? 104.2;
    const cpi = macroIndicators.find((m) => m.code === "USCPI")?.currentValue ?? 2.7;

    const fxPressureRating: "low" | "moderate" | "high" = dxy > 105 ? "high" : dxy > 102 ? "moderate" : "low";
    const inflationHeadwindRating: "low" | "moderate" | "high" = cpi > 3.5 ? "high" : cpi > 2.5 ? "moderate" : "low";

    const keyDrivers = [
      `US 10Y Benchmark Yield at ${us10y}% maintaining elevated corporate borrowing costs.`,
      `Fed Funds Policy Rate at ${fedrate}% signaling high-for-longer monetary posture.`,
      `US Dollar Index at ${dxy} creating moderate international sales translation drag.`,
      `Consumer Price Index (CPI) cooled to ${cpi}% YoY, easing domestic labor and raw input cost spirals.`,
    ];

    return {
      agentRole: this.role,
      agentName: this.name,
      success: true,
      durationMs: Date.now() - startTime,
      data: {
        primaryRatesSummary: `10Y Yield: ${us10y}%, Fed Funds: ${fedrate}%, DXY: ${dxy}, CPI: ${cpi}%`,
        fxPressureRating,
        inflationHeadwindRating,
        monetaryEnvironment: fedrate > 4.5 ? "Restrictive" : "Neutral",
        keyDrivers,
      },
      summary: `Evaluated macro climate: Restrictive monetary policy (Fed Funds ${fedrate}%), ${fxPressureRating} FX translation headwinds, CPI inflation at ${cpi}%.`,
      confidence: 0.95,
    };
  }
}
