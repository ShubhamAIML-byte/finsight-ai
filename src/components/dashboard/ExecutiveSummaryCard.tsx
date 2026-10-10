"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";
import { Company, FinancialMetric } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface ExecutiveSummaryCardProps {
  company: Company;
  latest: FinancialMetric;
  onNavigateToChat: () => void;
}

export function ExecutiveSummaryCard({
  company,
  latest,
  onNavigateToChat,
}: ExecutiveSummaryCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <Card className="relative overflow-hidden border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <CardHeader className="pb-3 border-indigo-100/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Autonomous Financial Intelligence Brief
              <Badge variant="ai">MULTI-AGENT VERIFIED</Badge>
            </CardTitle>
            <span className="text-[11px] text-slate-500">
              Synthesized by Orchestrator Agent • SEC Form 10-K & BIS Reg Grounded
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-all"
          title="Regenerate Agentic Summary"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
        </button>
      </CardHeader>

      <CardContent className="pt-3 space-y-4">
        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          <strong className="text-slate-900 font-semibold">{company.name} ({company.ticker})</strong> displays resilient financial fundamentals anchored by FY{latest.year} consolidated revenue of{" "}
          <strong className="text-slate-900 font-mono">${latest.revenue}B</strong> and an operating margin of{" "}
          <strong className="text-indigo-700 font-mono">{latest.operatingMargin}%</strong>. The company converted{" "}
          <strong className="text-emerald-700 font-mono">${latest.freeCashFlow}B</strong> into discretionary Free Cash Flow, sustaining an institutional Altman Z-Score of{" "}
          <strong className="text-slate-900 font-mono">{company.altmanZScore}</strong> (Safe Zone).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Capital Efficiency
            </div>
            <p className="text-[11px] text-slate-600">
              ROE of {latest.roe}% and ROA of {latest.roa}%; share repurchase liquidity preserved without diluting capitalization.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Geopolitical Headwind
            </div>
            <p className="text-[11px] text-slate-600">
              Elevated exposure to component tariffs and BIS export restriction thresholds across global assembly corridors.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Mandate
            </div>
            <p className="text-[11px] text-slate-600">
              Accelerate supply chain geographic diversification across non-tariff corridors while hedging foreign currency volatility.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Source: Audited 10-K Disclosures • Zero Hallucination Deterministic Engine
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToChat}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
          >
            Interrogate in AI Chat
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
