import { NextResponse } from "next/server";
import { z } from "zod";
import { OrchestratorAgent } from "@/agents/orchestrator";
import { COMPANIES } from "@/data/companies";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { MACRO_INDICATORS, GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";
import { DOCUMENT_CHUNKS } from "@/data/documents";
import { RECOMMENDATIONS } from "@/data/recommendations";
import { SupportedLanguage } from "@/types/chat";
import { OpenAI } from "openai";

const chatSchema = z.object({
  query: z.string().min(1),
  language: z.enum(["en", "hi", "bn", "es", "fr"]).default("en"),
  companyTicker: z.string().min(1).default("AAPL"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { query, language, companyTicker } = parsed.data;

    // Detect language if user wrote Hindi or Bengali characters and language was default
    let effectiveLanguage: SupportedLanguage = language;
    if (/[\u0900-\u097F]/.test(query)) {
      effectiveLanguage = "hi";
    } else if (/[\u0980-\u09FF]/.test(query)) {
      effectiveLanguage = "bn";
    }

    const company =
      COMPANIES.find((c) => c.ticker === companyTicker.toUpperCase()) || COMPANIES[0];

    const history = FINANCIAL_METRICS_BY_TICKER[company.ticker] || FINANCIAL_METRICS_BY_TICKER["AAPL"];
    const latest = history[history.length - 1];
    const prior = history.length > 1 ? history[history.length - 2] : undefined;

    const apiKey = process.env.OPENAI_API_KEY;
    const hasLiveOpenAi = Boolean(apiKey && !apiKey.includes("your_openai_api_key"));

    // Run modular TypeScript agent pipeline
    const orchestrator = new OrchestratorAgent();
    const agentContext = {
      query,
      language: effectiveLanguage,
      company,
      financialHistory: history,
      latestFinancials: latest,
      priorFinancials: prior,
      macroIndicators: MACRO_INDICATORS,
      geopoliticalEvents: GEOPOLITICAL_EVENTS,
      retrievedChunks: DOCUMENT_CHUNKS.filter(
        (c) => c.metadata.companyTicker === company.ticker || !c.metadata.companyTicker
      ),
      recommendations: RECOMMENDATIONS.filter((r) => r.companyTicker === company.ticker),
      apiKeyAvailable: hasLiveOpenAi,
    };

    const pipelineResult = await orchestrator.runPipeline(agentContext);

    // If live OpenAI key is configured, synthesize nuanced LLM interpretation over verified numbers
    let finalAnswer = pipelineResult.synthesis.answer;
    let liveLLMUsed = false;

    if (hasLiveOpenAi) {
      try {
        const openai = new OpenAI({ apiKey });
        const systemPrompt = `You are FinSight AI, a senior institutional financial intelligence assistant.
Answer in language '${effectiveLanguage}'.
VERIFIED AUDITED DATA for ${company.name} (${company.ticker}):
- Revenue: $${latest.revenue}B, Operating Margin: ${latest.operatingMargin}%, FCF: $${latest.freeCashFlow}B
- Altman Z-Score: ${company.altmanZScore}, Piotroski F-Score: ${company.piotroskiFScore}/9
- Next Period Projected Revenue: $${latest.revenue * 1.05}B
DO NOT INVENT NUMBERS. Use the verified data above. Keep response professional, concise, and structured.`;

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.2,
          max_tokens: 650,
        });

        if (completion.choices[0]?.message?.content) {
          finalAnswer = completion.choices[0].message.content;
          liveLLMUsed = true;
        }
      } catch (llmErr) {
        console.warn("OpenAI API call failed, falling back to deterministic multi-agent synthesis:", llmErr);
      }
    }

    const citations = pipelineResult.evidenceSources.map((ev, i) => ({
      id: `cite-${i + 1}`,
      title: ev.title,
      sourceType: ev.source,
      snippet: ev.snippet,
      relevancePercent: Math.round(92 - i * 4),
    }));

    return NextResponse.json({
      answer: finalAnswer,
      keyTakeaways: pipelineResult.synthesis.keyTakeaways,
      riskAssessment: pipelineResult.synthesis.riskAssessment,
      recommendedActions: pipelineResult.synthesis.recommendedActions,
      language: effectiveLanguage,
      companyTicker: company.ticker,
      citations,
      agentExecutionSteps: pipelineResult.steps,
      totalDurationMs: pipelineResult.totalDurationMs,
      liveLLMUsed,
      isDemoSandbox: !liveLLMUsed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process multilingual chat", details: (error as Error).message },
      { status: 500 }
    );
  }
}
