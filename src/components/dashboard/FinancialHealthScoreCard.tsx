"use client";

import React from "react";
import { ShieldCheck, Activity, Award, HelpCircle } from "lucide-react";
import { Company, FinancialMetric } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { calculateAltmanZScore, calculatePiotroskiFScore } from "@/lib/financial-math";

interface FinancialHealthScoreCardProps {
  company: Company;
  current: FinancialMetric;
  prior?: FinancialMetric;
}

export function FinancialHealthScoreCard({
  company,
  current,
  prior,
}: FinancialHealthScoreCardProps) {
  const altman = calculateAltmanZScore(current, company.marketCap);
  const piotroski = calculatePiotroskiFScore(current, prior);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Solvency & Financial Health Matrix</CardTitle>
          <CardDescription>
            Rigorous quantitative models: Altman Z-Score (bankruptcy probability) & Piotroski F-Score (accounting strength)
          </CardDescription>
        </div>
        <Badge variant="positive">INVESTMENT GRADE</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Composite FinSight Health Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Composite FinSight Score
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {company.healthScore} / 100
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              style={{ width: `${company.healthScore}%` }}
            />
          </div>
        </div>

        {/* Altman Z-Score & Piotroski F-Score side by side */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800">Altman Z-Score</span>
              <Badge variant={altman.zone === "safe" ? "positive" : altman.zone === "grey" ? "warning" : "negative"}>
                {altman.zone.toUpperCase()}
              </Badge>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 my-1">{altman.score}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {altman.interpretation}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-800">Piotroski F-Score</span>
              <Badge variant={piotroski.score >= 7 ? "positive" : piotroski.score >= 5 ? "warning" : "negative"}>
                {piotroski.score >= 7 ? "HIGH QUALITY" : "MODERATE"}
              </Badge>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 my-1">
              {piotroski.score} <span className="text-xs font-normal text-slate-400">/ 9</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Passed {piotroski.score} of 9 accounting criteria for profitability, leverage, and operating efficiency.
            </p>
          </div>
        </div>

        {/* Selected Piotroski criteria passes */}
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Key Health Checks
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {piotroski.criteria.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <span className={`w-2 h-2 rounded-full ${c.pass ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
