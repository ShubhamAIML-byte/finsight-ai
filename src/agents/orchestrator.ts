import { AgentContext } from "./types";
import { FinancialAnalysisAgent } from "./financial-analysis-agent";
import { EconomicIntelligenceAgent } from "./economic-intelligence-agent";
import { GeopoliticalRiskAgent } from "./geopolitical-risk-agent";
import { IndustryIntelligenceAgent } from "./industry-intelligence-agent";
import { ForecastingAgent } from "./forecasting-agent";
import { RecommendationAgent } from "./recommendation-agent";
import { ExplainabilityAgent } from "./explainability-agent";
import { AgentExecutionStep, OrchestrationPipelineResult } from "@/types/agent";
import { SupportedLanguage } from "@/types/chat";

export class OrchestratorAgent {
  private financialAgent = new FinancialAnalysisAgent();
  private economicAgent = new EconomicIntelligenceAgent();
  private geopoliticalAgent = new GeopoliticalRiskAgent();
  private industryAgent = new IndustryIntelligenceAgent();
  private forecastingAgent = new ForecastingAgent();
  private recommendationAgent = new RecommendationAgent();
  private explainabilityAgent = new ExplainabilityAgent();

  public async runPipeline(context: AgentContext): Promise<OrchestrationPipelineResult> {
    const pipelineStartTime = Date.now();
    const steps: AgentExecutionStep[] = [];

    // Step 1: Financial Analysis
    const step1Start = Date.now();
    const financialRes = await this.financialAgent.analyze(context);
    steps.push({
      id: "step-1",
      agentRole: "financial_analysis",
      agentName: this.financialAgent.name,
      status: financialRes.success ? "completed" : "failed",
      startedAt: new Date(step1Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: financialRes.durationMs,
      inputSummary: `Audited statements for ${context.company.name} (${context.company.ticker})`,
      outputSummary: financialRes.summary,
      confidence: financialRes.confidence,
    });

    // Step 2: Economic Intelligence
    const step2Start = Date.now();
    const economicRes = await this.economicAgent.analyze(context);
    steps.push({
      id: "step-2",
      agentRole: "economic_intelligence",
      agentName: this.economicAgent.name,
      status: economicRes.success ? "completed" : "failed",
      startedAt: new Date(step2Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: economicRes.durationMs,
      inputSummary: `Macro rates: US10Y, Fed Funds, DXY, Inflation`,
      outputSummary: economicRes.summary,
      confidence: economicRes.confidence,
    });

    // Step 3: Geopolitical Risk
    const step3Start = Date.now();
    const geopoliticalRes = await this.geopoliticalAgent.analyze(context);
    steps.push({
      id: "step-3",
      agentRole: "geopolitical_risk",
      agentName: this.geopoliticalAgent.name,
      status: geopoliticalRes.success ? "completed" : "failed",
      startedAt: new Date(step3Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: geopoliticalRes.durationMs,
      inputSummary: `Geopolitical trade and tariff mandates for ${context.company.industry}`,
      outputSummary: geopoliticalRes.summary,
      confidence: geopoliticalRes.confidence,
    });

    // Step 4: Industry Intelligence
    const step4Start = Date.now();
    const industryRes = await this.industryAgent.analyze(context);
    steps.push({
      id: "step-4",
      agentRole: "industry_intelligence",
      agentName: this.industryAgent.name,
      status: industryRes.success ? "completed" : "failed",
      startedAt: new Date(step4Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: industryRes.durationMs,
      inputSummary: `Competitive dynamics in ${context.company.sector}`,
      outputSummary: industryRes.summary,
      confidence: industryRes.confidence,
    });

    // Step 5: Forecasting
    const step5Start = Date.now();
    const forecastRes = await this.forecastingAgent.analyze(context);
    steps.push({
      id: "step-5",
      agentRole: "forecasting",
      agentName: this.forecastingAgent.name,
      status: forecastRes.success ? "completed" : "failed",
      startedAt: new Date(step5Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: forecastRes.durationMs,
      inputSummary: `Historical 5-year revenue series`,
      outputSummary: forecastRes.summary,
      confidence: forecastRes.confidence,
    });

    // Step 6: Strategic Recommendations
    const step6Start = Date.now();
    const recommendationRes = await this.recommendationAgent.analyze(context);
    steps.push({
      id: "step-6",
      agentRole: "recommendation",
      agentName: this.recommendationAgent.name,
      status: recommendationRes.success ? "completed" : "failed",
      startedAt: new Date(step6Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: recommendationRes.durationMs,
      inputSummary: `Prioritized strategy catalog for ${context.company.ticker}`,
      outputSummary: recommendationRes.summary,
      confidence: recommendationRes.confidence,
    });

    // Step 7: Explainability & Evidence
    const step7Start = Date.now();
    const explainabilityRes = await this.explainabilityAgent.analyze(context);
    steps.push({
      id: "step-7",
      agentRole: "explainability",
      agentName: this.explainabilityAgent.name,
      status: explainabilityRes.success ? "completed" : "failed",
      startedAt: new Date(step7Start).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: explainabilityRes.durationMs,
      inputSummary: `Shapley decomposition & regulatory document provenance`,
      outputSummary: explainabilityRes.summary,
      confidence: explainabilityRes.confidence,
    });

    // Evidence sources assembled from retrieved chunks and explainability
    const evidenceSources = [
      ...context.retrievedChunks.slice(0, 3).map((c) => ({
        title: `${c.metadata.companyTicker || context.company.ticker} ${c.metadata.reportingPeriod || "Filing"} (${c.metadata.sectionHeading || "Section"})`,
        snippet: c.content,
        source: "Audited SEC Document / 10-K",
      })),
      ...explainabilityRes.data.explainability.evidenceChain.slice(0, 2).map((e) => ({
        title: e.sourceTitle,
        snippet: e.citationSnippet,
        source: e.sourceType,
      })),
    ];

    // Generate Multilingual Synthesis
    const synthesis = this.generateMultilingualSynthesis(
      context.language,
      context.company.name,
      context.company.ticker,
      financialRes.data.operatingMargin,
      financialRes.data.revenueGrowthYoY,
      forecastRes.data.projectedNextYearRevenue,
      forecastRes.data.projectedGrowthPercent,
      geopoliticalRes.data.overallThreatScore,
      recommendationRes.data.topRecommendationTitle,
      recommendationRes.data.expectedAnnualImpactRange
    );

    return {
      query: context.query,
      targetCompanyTicker: context.company.ticker,
      steps,
      totalDurationMs: Date.now() - pipelineStartTime,
      synthesis,
      evidenceSources,
      timestamp: new Date().toISOString(),
    };
  }

  private generateMultilingualSynthesis(
    lang: SupportedLanguage,
    name: string,
    ticker: string,
    operatingMargin: number,
    revenueGrowthYoY: number,
    projRev: number,
    projGrowth: number,
    threatScore: number,
    topRecTitle: string,
    expectedImpact: string
  ) {
    switch (lang) {
      case "hi":
        return {
          answer: `${name} (${ticker}) का वित्तीय विश्लेषण दर्शाता है कि कंपनी का ऑपरेटिंग मार्जिन ${operatingMargin}% है और वार्षिक राजस्व वृद्धि ${revenueGrowthYoY}% रही है। हमारे पूर्वानुमान मॉडल के अनुसार, अगले वित्तीय वर्ष का अनुमानित राजस्व $${projRev}B (${projGrowth > 0 ? "+" : ""}${projGrowth}%) रहने का अनुमान है। भू-राजनीतिक जोखिम स्कोर ${threatScore}/100 है।`,
          keyTakeaways: [
            `ऑपरेटिंग लाभप्रदता ${operatingMargin}% पर मजबूत बनी हुई है।`,
            `अगले वित्तीय वर्ष में राजस्व $${projRev}B तक पहुंचने का अनुमान है।`,
            `टैरिफ और आपूर्ति श्रृंखला के चलते भू-राजनीतिक जोखिम सूचकांक ${threatScore}/100 पर है।`,
          ],
          riskAssessment: `मध्यम से उच्च भू-राजनीतिक संवेदनशीलता (${threatScore}/100), विशेष रूप से सीमा पार व्यापार और उन्नत आपूर्ति श्रृंखलाओं में।`,
          recommendedActions: [
            `सर्वोच्च रणनीतिक पहल: "${topRecTitle}"`,
            `अनुमानित वार्षिक वित्तीय प्रभाव: ${expectedImpact}`,
            "मुद्रा जोखिम को कम करने के लिए हेजिंग और क्षेत्रीय मूल्य निर्धारण में सुधार करें।",
          ],
        };

      case "bn":
        return {
          answer: `${name} (${ticker})-এর আর্থিক স্বাস্থ্য অত্যন্ত স্থিতিশীল। কোম্পানির অপারেটিং মার্জিন ${operatingMargin}% এবং রাজস্ব বৃদ্ধি ${revenueGrowthYoY}%। আমাদের পূর্বাভাস ইঞ্জিন অনুসারে, পরবর্তী অর্থবর্ষে আনুমানিক রাজস্ব $${projRev}B (${projGrowth > 0 ? "+" : ""}${projGrowth}%) হতে পারে। ভূ-রাজনৈতিক ঝুঁকি স্কোর ${threatScore}/100।`,
          keyTakeaways: [
            `কোম্পানির অপারেটিং মার্জিন ${operatingMargin}%, যা শিল্পের মধ্যে শীর্ষস্থানীয়।`,
            `পরবর্তী বছরের রাজস্ব প্রক্ষেপণ $${projRev}B।`,
            `ভূ-রাজনৈতিক ঝুঁকি সূচক ${threatScore}/100 নির্দেশ করছে সতর্ক পর্যবেক্ষণের প্রয়োজনীয়তা।`,
          ],
          riskAssessment: `আমদানি শুল্ক এবং আন্তর্জাতিক মুদ্রার ওঠানামার কারণে ঝুঁকি সূচক ${threatScore}/100।`,
          recommendedActions: [
            `প্রধান সুপারিশ: "${topRecTitle}"`,
            `প্রত্যাশিত বার্ষিক প্রভাব: ${expectedImpact}`,
            "আঞ্চলিক উৎপাদন বহুমুখীকরণ ও ক্যাশ-ফ্লো সুরক্ষা অগ্রাধিকার দেওয়া উচিত।",
          ],
        };

      case "es":
        return {
          answer: `El análisis institucional de ${name} (${ticker}) refleja un sólido margen operativo del ${operatingMargin}% y un crecimiento de ingresos interanual del ${revenueGrowthYoY}%. Nuestro laboratorio de proyección estima unos ingresos para el próximo ejercicio de $${projRev}B (${projGrowth > 0 ? "+" : ""}${projGrowth}%). El índice de riesgo geopolítico se sitúa en ${threatScore}/100.`,
          keyTakeaways: [
            `Rentabilidad operativa sólida con un margen del ${operatingMargin}%.`,
            `Ingresos proyectados para el próximo periodo de $${projRev}B.`,
            `Exposición al riesgo geopolítico calificada en ${threatScore}/100 debido a aranceles comerciales.`,
          ],
          riskAssessment: `Vulnerabilidad geopolítica moderada-alta (${threatScore}/100), condicionada por controles de exportación y aranceles sobre insumos clave.`,
          recommendedActions: [
            `Iniciativa prioritaria: "${topRecTitle}"`,
            `Impacto financiero estimado: ${expectedImpact}`,
            "Optimizar la diversificación de proveedores y calibrar coberturas cambiarias.",
          ],
        };

      case "fr":
        return {
          answer: `L'évaluation financière approfondie de ${name} (${ticker}) démontre une marge opérationnelle robuste de ${operatingMargin}% et une croissance annuelle du chiffre d'affaires de ${revenueGrowthYoY}%. Notre modèle prévisionnel anticipe un chiffre d'affaires futur de $${projRev}B (${projGrowth > 0 ? "+" : ""}${projGrowth}%). L'indice de risque géopolitique est évalué à ${threatScore}/100.`,
          keyTakeaways: [
            `Marge d'exploitation solide établie à ${operatingMargin}%.`,
            `Chiffre d'affaires projeté pour le prochain exercice : $${projRev}B.`,
            `Score de vulnérabilité géopolitique mesuré à ${threatScore}/100 (tensions tarifaires).`,
          ],
          riskAssessment: `Sensibilité géopolitique modérée (${threatScore}/100) liée aux restrictions d'exportation technologiques et aux ajustements de la chaîne logistique.`,
          recommendedActions: [
            `Recommandation stratégique prioritaire : "${topRecTitle}"`,
            `Impact financier prévisionnel : ${expectedImpact}`,
            "Renforcer la double source d'approvisionnement et stabiliser les flux de trésorerie.",
          ],
        };

      case "en":
      default:
        return {
          answer: `Institutional intelligence analysis for ${name} (${ticker}) indicates solid financial fundamentals with an operating margin of ${operatingMargin}% and annual revenue growth of ${revenueGrowthYoY}%. Deterministic multi-model forecasting projects next-period revenues of $${projRev}B (${projGrowth > 0 ? "+" : ""}${projGrowth}% YoY). Geopolitical risk is indexed at ${threatScore}/100 based on active trade regulations.`,
          keyTakeaways: [
            `Operating profitability remains top-quartile with a margin of ${operatingMargin}%.`,
            `Walk-forward validated revenue forecast indicates $${projRev}B in the upcoming fiscal period.`,
            `Geopolitical & tariff risk score stands at ${threatScore}/100, driven by bilateral export controls and supply frictions.`,
          ],
          riskAssessment: `Moderate-to-high supply chain and tariff vulnerability (${threatScore}/100) driven by international regulatory mandates.`,
          recommendedActions: [
            `Priority Strategic Directive: "${topRecTitle}"`,
            `Estimated Annual Financial Impact: ${expectedImpact}`,
            "Execute foreign exchange hedging and accelerate regional assembly diversification.",
          ],
        };
    }
  }
}
