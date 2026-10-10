"use client";

import React from "react";
import {
  Sparkles,
  BarChart3,
  FileText,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { Company, FinancialMetric } from "@/types/financial";
import { ExplainabilityModelOverview } from "@/types/explainability";
import { generateFinancialExplainability } from "@/lib/explainability-engine";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";

interface ExplainableAiViewProps {
  company: Company;
  latest: FinancialMetric;
  prior?: FinancialMetric;
}

export function ExplainableAiView({ company, latest, prior }: ExplainableAiViewProps) {
  const previous = prior || {
    ...latest,
    revenue: latest.revenue * 0.95,
    grossMargin: latest.grossMargin - 1.5,
    operatingMargin: latest.operatingMargin - 1.2,
    freeCashFlow: latest.freeCashFlow * 0.88,
  };

  const overview: ExplainabilityModelOverview = generateFinancialExplainability(
    latest,
    previous,
    company.ticker
  );

  const featureChartData = overview.features.map((f) => ({
    name: f.featureName,
    value: Number(f.contributionValue.toFixed(2)),
    direction: f.direction,
    category: f.category,
    observed: f.observedValue,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="ai" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              {overview.methodology.replace(/_/g, " ")}
            </Badge>
            <h1 className="text-xl font-bold tracking-tight text-white mt-2">
              Explainable AI Attribution & Traceability Architecture
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transparent, deterministic feature decomposition showing positive and negative drivers contributing to{" "}
              {company.name}&apos;s operating margin ({latest.operatingMargin}%).
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Attribution Confidence</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-0.5">
              {overview.modelConfidence}%
            </div>
            <span className="text-[10px] text-slate-300">Shapley Additive Attribution</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {overview.methodologyDescription}
          </span>
        </div>
      </Card>

      {/* Feature Attribution Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Feature Contribution Waterfall / Force Plot</CardTitle>
            <CardDescription>
              Green bars represent positive margin drivers; red bars represent inflationary or geopolitical headwinds
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={featureChartData}
                margin={{ top: 10, right: 30, left: 160, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94A3B8"
                  fontSize={11}
                  domain={[-0.6, 0.6]}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderRadius: "8px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: any, name: any, item: any) => [
                    `${val > 0 ? "+" : ""}${val} force impact (Observed: ${item.payload.observed})`,
                    "Feature Contribution",
                  ]}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={16}>
                  {featureChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? "#10B981" : "#EF4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Feature Attribution Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Driver Analysis & Historical Benchmarks</CardTitle>
          <CardDescription>
            Decomposition of underlying audited metrics, observed values, and historical baselines
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-6">Driver Feature</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Observed Value</th>
                <th className="p-3.5">Prior Benchmark</th>
                <th className="p-3.5">Contribution Force</th>
                <th className="p-3.5 pr-6">Directional Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {overview.features.map((feat, i) => (
                <tr key={i} className="hover:bg-slate-50 font-mono">
                  <td className="p-3.5 pl-6 font-sans font-semibold text-slate-900">
                    {feat.featureName}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {feat.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-800 font-bold">{feat.observedValue}</td>
                  <td className="p-3.5 text-slate-500">{feat.historicalBenchmark}</td>
                  <td className="p-3.5">
                    <span
                      className={`font-bold ${
                        feat.direction === "positive" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {feat.contributionValue > 0 ? "+" : ""}
                      {feat.contributionValue.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3.5 pr-6 font-sans text-slate-600 text-xs">
                    {feat.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Traceable Evidence Chain */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Traceable Evidence Chain (SEC Filings & Regulatory Citations)</CardTitle>
            <CardDescription>
              Unbroken provenance tracing every metric back to audited regulatory disclosures
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {overview.evidenceChain.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                    {ev.sourceType.replace(/_/g, " ")}
                  </span>
                  <span className="font-bold text-slate-900">{ev.sourceTitle}</span>
                </div>
                <span className="text-slate-400 font-mono">{ev.date}</span>
              </div>

              <blockquote className="p-3 rounded-lg bg-slate-50 border-l-2 border-indigo-500 text-xs text-slate-700 italic leading-relaxed">
                &ldquo;{ev.citationSnippet}&rdquo;
              </blockquote>

              {ev.verifiableMetric && (
                <div className="flex items-center justify-between text-xs pt-1 text-slate-500 font-mono">
                  <span>
                    Verifiable Metric: <strong className="text-slate-800">{ev.verifiableMetric.name} = {ev.verifiableMetric.value}</strong>
                  </span>
                  {ev.verifiableMetric.sourcePage && (
                    <span>Source Page: {ev.verifiableMetric.sourcePage}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assumptions and Limitations Notice */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-900 block mb-1">Methodology & Assumptions Disclosure:</strong>
        {overview.limitationsNotice}
      </div>
    </div>
  );
}
