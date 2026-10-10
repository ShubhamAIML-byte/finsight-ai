"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Sliders,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Table as TableIcon,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Company, FinancialMetric } from "@/types/financial";
import { ForecastHorizon, ForecastModelType, ForecastResult } from "@/types/forecasting";
import { generateFinancialForecast } from "@/lib/forecasting-engine";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ForecastingLabViewProps {
  company: Company;
  history: FinancialMetric[];
}

export function ForecastingLabView({ company, history }: ForecastingLabViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("revenue");
  const [selectedModel, setSelectedModel] = useState<ForecastModelType>("ensemble_weighted");
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>("annual");
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);

  const metricOptions = [
    { id: "revenue", label: "Consolidated Revenue ($B)" },
    { id: "ebitda", label: "EBITDA ($B)" },
    { id: "netIncome", label: "Net Income ($B)" },
    { id: "freeCashFlow", label: "Free Cash Flow ($B)" },
  ];

  const modelOptions: { id: ForecastModelType; label: string; description: string }[] = [
    {
      id: "ensemble_weighted",
      label: "Multi-Model Ensemble",
      description: "Combines Linear Trend (40%), Holt's Smoothing (40%), and AR(1) (20%)",
    },
    {
      id: "linear_trend",
      label: "OLS Linear Regression",
      description: "Ordinary Least Squares trend line fitted on audited fiscal series",
    },
    {
      id: "holt_exponential_smoothing",
      label: "Holt's Double Smoothing",
      description: "Recursive level and trend smoothing capturing momentum shifts",
    },
    {
      id: "autoregressive_ar1",
      label: "Autoregressive Baseline (AR-1)",
      description: "Mean-reverting first-order stochastic process",
    },
  ];

  const horizonOptions: { id: ForecastHorizon; label: string }[] = [
    { id: "quarterly", label: "Quarterly (4 Quarters)" },
    { id: "annual", label: "1 Year Forward" },
    { id: "three_year", label: "3-Year Horizon" },
    { id: "five_year", label: "5-Year Horizon" },
  ];

  // Re-run forecast when parameters change
  useEffect(() => {
    const metricObservations = history.map((h) => ({
      year: h.year,
      period: `FY${h.year}`,
      value: (h as unknown as Record<string, number>)[selectedMetric] ?? h.revenue,
    }));

    const result = generateFinancialForecast(metricObservations, {
      metric: selectedMetric,
      metricLabel: metricOptions.find((m) => m.id === selectedMetric)?.label || selectedMetric,
      companyTicker: company.ticker,
      modelType: selectedModel,
      horizon: selectedHorizon,
    });

    setForecastResult(result);
  }, [selectedMetric, selectedModel, selectedHorizon, company, history]);

  if (!forecastResult) return null;

  // Prepare combined chart data (actuals + predicted intervals)
  const combinedChartData = [
    ...forecastResult.historicalData.map((d) => ({
      period: `FY${d.period}`,
      actual: d.value,
      predicted: null,
      lower80: null,
      upper80: null,
      lower95: null,
      upper95: null,
    })),
    // Bridge point to connect the line seamlessly
    {
      period: `FY${forecastResult.historicalData[forecastResult.historicalData.length - 1].period}`,
      actual: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
      predicted: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
      lower80: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
      upper80: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
      lower95: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
      upper95: forecastResult.historicalData[forecastResult.historicalData.length - 1].value,
    },
    ...forecastResult.forecastPoints.map((p) => ({
      period: p.period.startsWith("Q") ? p.period : `FY${p.period}`,
      actual: null,
      predicted: p.predicted,
      lower80: p.lowerBound80,
      upper80: p.upperBound80,
      lower95: p.lowerBound95,
      upper95: p.upperBound95,
      band80: [p.lowerBound80, p.upperBound80],
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Financial Metric Target
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {metricOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Forecasting Algorithm
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ForecastModelType)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {modelOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Horizon Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Projection Horizon
            </label>
            <select
              value={selectedHorizon}
              onChange={(e) => setSelectedHorizon(e.target.value as ForecastHorizon)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {horizonOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning Banner if applicable */}
        {forecastResult.warningMessage && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{forecastResult.warningMessage}</span>
          </div>
        )}
      </Card>

      {/* Main Interactive Forecast Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              Time-Series Forecast & Prediction Envelope
              <Badge variant="ai">{forecastResult.modelName.toUpperCase()}</Badge>
            </CardTitle>
            <CardDescription>
              Chronologically projected path with 80% and 95% statistical confidence intervals
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                  formatter={(val: any, name: any) => {
                    if (val === null || val === undefined) return ["—", name];
                    return [`$${val}B`, name];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
                />

                {/* Prediction Interval 95% Envelope */}
                <Area
                  dataKey="upper95"
                  name="95% Upper Bound"
                  stroke="none"
                  fill="#E0E7FF"
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="lower95"
                  name="95% Lower Bound"
                  stroke="none"
                  fill="#FFFFFF"
                  fillOpacity={1.0}
                />

                {/* Historical Actuals */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Audited Historical"
                  stroke="#1E293B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#1E293B" }}
                />

                {/* Predicted Path */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted Value"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#6366F1" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Evaluation & Metrics Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Out-of-sample Validation Card */}
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Mean Absolute Percentage Error (MAPE)
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-600">
            {forecastResult.evaluation.mape}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Evaluated via walk-forward chronological split ({forecastResult.evaluation.trainPeriods} vs {forecastResult.evaluation.testPeriods}) without data leakage.
          </p>
        </Card>

        {/* RMSE / MAE Card */}
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Root Mean Squared Error (RMSE)
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ${forecastResult.evaluation.rmse}B
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Mean Absolute Error (MAE): ${forecastResult.evaluation.mae}B across {forecastResult.evaluation.sampleSize} sample observations.
          </p>
        </Card>

        {/* Alternative Model Comparison */}
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Alternative Baseline Comparison
          </span>
          <div className="text-sm font-bold text-slate-900">
            {forecastResult.alternativeModelEvaluation?.modelName}
          </div>
          <div className="text-xs font-mono text-slate-600 mt-1">
            Benchmark MAPE: {forecastResult.alternativeModelEvaluation?.evaluation.mape}% (RMSE: ${forecastResult.alternativeModelEvaluation?.evaluation.rmse}B)
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            Ensemble model outperforms baseline by{" "}
            {Math.max(
              0,
              (forecastResult.alternativeModelEvaluation?.evaluation.mape || 0) -
                forecastResult.evaluation.mape
            ).toFixed(1)}
            % accuracy.
          </p>
        </Card>
      </div>

      {/* Forecast Data Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Forecast Tabular Output & Prediction Intervals</CardTitle>
            <CardDescription>
              Detailed period projections with lower/upper bound standard error ranges
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-6">Period</th>
                <th className="p-3.5 text-right">Predicted Value</th>
                <th className="p-3.5 text-right">80% Conf. Interval</th>
                <th className="p-3.5 text-right">95% Conf. Interval</th>
                <th className="p-3.5 pr-6 text-right">Standard Error Span</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {forecastResult.forecastPoints.map((point) => (
                <tr key={point.period} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-6 font-sans font-bold text-slate-900">
                    {point.period}
                  </td>
                  <td className="p-3.5 text-right font-bold text-indigo-600">
                    ${point.predicted}B
                  </td>
                  <td className="p-3.5 text-right text-slate-700">
                    ${point.lowerBound80}B – ${point.upperBound80}B
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    ${point.lowerBound95}B – ${point.upperBound95}B
                  </td>
                  <td className="p-3.5 pr-6 text-right text-slate-500">
                    ±${((point.upperBound95 - point.predicted)).toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
