"use client";

import React, { useState, useMemo } from "react";
import {
  Sliders,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Company, FinancialMetric } from "@/types/financial";
import { ScenarioParams, ScenarioResult } from "@/types/scenario";
import { STRESS_TEST_PRESETS } from "@/lib/constants";
import { calculateScenarioImpact } from "@/lib/scenario-engine";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ScenarioSimulatorViewProps {
  company: Company;
  latestFinancials: FinancialMetric;
}

export function ScenarioSimulatorView({
  company,
  latestFinancials,
}: ScenarioSimulatorViewProps) {
  const defaultParams: ScenarioParams = {
    currencyMovement: 0,
    tariffIncrease: 0,
    interestRateChange: 0,
    supplyChainCostIncrease: 0,
    revenueDecline: 0,
    marketDownturn: 0,
  };

  const [params, setParams] = useState<ScenarioParams>(defaultParams);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const scenarioResult: ScenarioResult = useMemo(() => {
    return calculateScenarioImpact(latestFinancials, params, company.ticker);
  }, [latestFinancials, params, company.ticker]);

  const handleApplyPreset = (presetId: string) => {
    const preset = STRESS_TEST_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setParams(preset.params);
      setActivePresetId(presetId);
    }
  };

  const handleReset = () => {
    setParams(defaultParams);
    setActivePresetId(null);
  };

  // Recharts baseline vs scenario data
  const comparisonData = [
    {
      metric: "Revenue",
      Baseline: scenarioResult.impactMetrics.revenue.baseline,
      Scenario: scenarioResult.impactMetrics.revenue.scenario,
      unit: "$B",
    },
    {
      metric: "COGS",
      Baseline: scenarioResult.impactMetrics.cogs.baseline,
      Scenario: scenarioResult.impactMetrics.cogs.scenario,
      unit: "$B",
    },
    {
      metric: "EBITDA",
      Baseline: scenarioResult.impactMetrics.ebitda.baseline,
      Scenario: scenarioResult.impactMetrics.ebitda.scenario,
      unit: "$B",
    },
    {
      metric: "Net Profit",
      Baseline: scenarioResult.impactMetrics.netIncome.baseline,
      Scenario: scenarioResult.impactMetrics.netIncome.scenario,
      unit: "$B",
    },
    {
      metric: "Free Cash Flow",
      Baseline: scenarioResult.impactMetrics.freeCashFlow.baseline,
      Scenario: scenarioResult.impactMetrics.freeCashFlow.scenario,
      unit: "$B",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Presets */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Interactive Macroeconomic & Operational Stress Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrate multi-factor external shocks to compute deterministic balance sheet and liquidity sensitivity for {company.name} ({company.ticker})
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset to Baseline
          </Button>
        </div>

        {/* Stress Test Presets Pills */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Institutional Stress Test Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {STRESS_TEST_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activePresetId === preset.id
                    ? "bg-indigo-50/80 border-indigo-300 shadow-sm ring-1 ring-indigo-400"
                    : "bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Grid: Controls + Impact Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Parameter Inputs (5 cols) */}
        <Card className="lg:col-span-5 p-5 space-y-4">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Shock Factor Sensitivity Controls</span>
            <span className="text-xs font-mono font-normal text-slate-400">Baseline FY{latestFinancials.year}</span>
          </CardTitle>

          {/* Slider 1: Tariff Increase */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Import Tariff Escalation</span>
              <span className="font-mono font-bold text-rose-600">+{params.tariffIncrease}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={params.tariffIncrease}
              onChange={(e) => {
                setParams({ ...params, tariffIncrease: Number(e.target.value) });
                setActivePresetId(null);
              }}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Status Quo)</span>
              <span>+35% (Severe Trade War)</span>
            </div>
          </div>

          {/* Slider 2: Supply Chain Cost Inflation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Supply Chain & Freight Surcharge</span>
              <span className="font-mono font-bold text-amber-600">+{params.supplyChainCostIncrease}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={params.supplyChainCostIncrease}
              onChange={(e) => {
                setParams({ ...params, supplyChainCostIncrease: Number(e.target.value) });
                setActivePresetId(null);
              }}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>+40% (Global Bottleneck)</span>
            </div>
          </div>

          {/* Slider 3: Currency Movement */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">USD vs Foreign FX Movement</span>
              <span className="font-mono font-bold text-indigo-600">
                {params.currencyMovement > 0 ? "+" : ""}
                {params.currencyMovement}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={params.currencyMovement}
              onChange={(e) => {
                setParams({ ...params, currencyMovement: Number(e.target.value) });
                setActivePresetId(null);
              }}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-20% (USD Weakens)</span>
              <span>+20% (USD Strengthens)</span>
            </div>
          </div>

          {/* Slider 4: Interest Rate Change */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Central Bank Rate Shift</span>
              <span className="font-mono font-bold text-slate-800">
                {params.interestRateChange > 0 ? "+" : ""}
                {params.interestRateChange}% ({params.interestRateChange * 100} bps)
              </span>
            </div>
            <input
              type="range"
              min="-3"
              max="5"
              step="0.25"
              value={params.interestRateChange}
              onChange={(e) => {
                setParams({ ...params, interestRateChange: Number(e.target.value) });
                setActivePresetId(null);
              }}
              className="w-full accent-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-300 bps (Easing)</span>
              <span>+500 bps (Monetary Shock)</span>
            </div>
          </div>

          {/* Slider 5: Revenue Volume Contraction */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">End-Market Demand Contraction</span>
              <span className="font-mono font-bold text-rose-600">
                {params.revenueDecline > 0 ? "+" : ""}
                {params.revenueDecline}%
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="10"
              step="1"
              value={params.revenueDecline}
              onChange={(e) => {
                setParams({ ...params, revenueDecline: Number(e.target.value) });
                setActivePresetId(null);
              }}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30% (Severe Contraction)</span>
              <span>+10% (Expansion)</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Chart & Score Assessment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stress Score & Vulnerability Banner */}
          <Card className="p-4 bg-slate-900 text-white border-none shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Simulated Vulnerability Risk Index
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {scenarioResult.stressScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  <Badge
                    variant={
                      scenarioResult.riskLevel === "severe"
                        ? "negative"
                        : scenarioResult.riskLevel === "high"
                        ? "warning"
                        : "positive"
                    }
                    className="ml-2"
                  >
                    {scenarioResult.riskLevel.toUpperCase()} VULNERABILITY
                  </Badge>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400">Operating Margin Compression:</span>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  {scenarioResult.impactMetrics.operatingMargin.baseline}% →{" "}
                  {scenarioResult.impactMetrics.operatingMargin.scenario.toFixed(1)}%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800 leading-relaxed">
              {scenarioResult.riskSummary}
            </p>
          </Card>

          {/* Baseline vs Scenario Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Baseline vs. Scenario Delta Comparison ($B)</CardTitle>
              <CardDescription>
                Audited baseline metrics vs. simulated shock output
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="metric" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}B`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      formatter={(val: any) => [`$${val}B`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={22} />
                    <Bar dataKey="Scenario" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delta Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Stress Impact Breakdown</CardTitle>
          <CardDescription>
            Deterministic variance calculations showing absolute and percentage changes across financial statements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-6">Financial Line Item</th>
                <th className="p-3.5 text-right font-mono">Baseline</th>
                <th className="p-3.5 text-right font-mono">Simulated</th>
                <th className="p-3.5 text-right font-mono">Absolute Delta</th>
                <th className="p-3.5 pr-6 text-right font-mono">% Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {Object.values(scenarioResult.impactMetrics).map((metric) => (
                <tr key={metric.key} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-6 font-sans font-medium text-slate-900">
                    {metric.name}
                  </td>
                  <td className="p-3.5 text-right text-slate-700">
                    {metric.format === "percent" ? `${metric.baseline}%` : `$${metric.baseline}B`}
                  </td>
                  <td className="p-3.5 text-right font-bold text-indigo-700">
                    {metric.format === "percent" ? `${metric.scenario.toFixed(1)}%` : `$${metric.scenario.toFixed(2)}B`}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className={metric.absoluteChange >= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {metric.absoluteChange >= 0 ? "+" : ""}
                      {metric.format === "percent" ? `${metric.absoluteChange.toFixed(1)}%` : `$${metric.absoluteChange.toFixed(2)}B`}
                    </span>
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <span
                      className={`font-semibold ${
                        metric.percentageChange >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {metric.percentageChange >= 0 ? "+" : ""}
                      {metric.percentageChange}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recommended Mitigation Directives */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Counter-Cyclical Mitigation Directives</CardTitle>
          <CardDescription>
            Tailored operational offsets to preserve cash flow and protect margins under current simulated conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarioResult.recommendedMitigations.map((plan, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                  Offset Action {i + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{plan.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug mt-1">{plan.action}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">{plan.estimatedCostSavings}</span>
                <span className="text-slate-400 font-mono">{plan.timeline}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-500 text-center">
        Disclaimer: Stress testing results are sensitivity estimates calculated via deterministic parametric formulas based on stated assumptions, not guaranteed forecasts.
      </div>
    </div>
  );
}
