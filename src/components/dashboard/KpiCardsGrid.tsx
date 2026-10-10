"use client";

import React from "react";
import { HelpCircle, DollarSign, TrendingUp, Percent, Wallet, Scale } from "lucide-react";
import { FinancialMetric, KpiCardData } from "@/types/financial";
import { Card, CardContent } from "../common/Card";
import { MetricDelta } from "../common/MetricDelta";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface KpiCardsGridProps {
  current: FinancialMetric;
  prior?: FinancialMetric;
}

export function KpiCardsGrid({ current, prior }: KpiCardsGridProps) {
  const prev = prior || current;

  const kpis: KpiCardData[] = [
    {
      title: "Consolidated Revenue",
      key: "revenue",
      value: current.revenue,
      previousValue: prev.revenue,
      changePercent: prev.revenue ? ((current.revenue - prev.revenue) / prev.revenue) * 100 : 0,
      formattedValue: formatCurrency(current.revenue),
      formattedPrevious: formatCurrency(prev.revenue),
      unit: "$B",
      format: "currency",
      trend: current.revenue >= prev.revenue ? "positive" : "negative",
      tooltip: "Total gross revenue generated from products and services in the latest fiscal year.",
    },
    {
      title: "EBITDA",
      key: "ebitda",
      value: current.ebitda,
      previousValue: prev.ebitda,
      changePercent: prev.ebitda ? ((current.ebitda - prev.ebitda) / prev.ebitda) * 100 : 0,
      formattedValue: formatCurrency(current.ebitda),
      formattedPrevious: formatCurrency(prev.ebitda),
      unit: "$B",
      format: "currency",
      trend: current.ebitda >= prev.ebitda ? "positive" : "negative",
      tooltip: "Earnings before interest, taxes, depreciation, and amortization.",
    },
    {
      title: "Net Profit (Income)",
      key: "netIncome",
      value: current.netIncome,
      previousValue: prev.netIncome,
      changePercent: prev.netIncome ? ((current.netIncome - prev.netIncome) / prev.netIncome) * 100 : 0,
      formattedValue: formatCurrency(current.netIncome),
      formattedPrevious: formatCurrency(prev.netIncome),
      unit: "$B",
      format: "currency",
      trend: current.netIncome >= prev.netIncome ? "positive" : "negative",
      tooltip: "Net income attributable to common shareholders after taxes and charges.",
    },
    {
      title: "Operating Margin",
      key: "operatingMargin",
      value: current.operatingMargin,
      previousValue: prev.operatingMargin,
      changePercent: current.operatingMargin - prev.operatingMargin,
      formattedValue: formatPercent(current.operatingMargin),
      formattedPrevious: formatPercent(prev.operatingMargin),
      unit: "%",
      format: "percent",
      trend: current.operatingMargin >= prev.operatingMargin ? "positive" : "negative",
      tooltip: "EBIT divided by Total Revenue; core measure of pricing power and cost discipline.",
    },
    {
      title: "Free Cash Flow (FCF)",
      key: "freeCashFlow",
      value: current.freeCashFlow,
      previousValue: prev.freeCashFlow,
      changePercent: prev.freeCashFlow ? ((current.freeCashFlow - prev.freeCashFlow) / Math.abs(prev.freeCashFlow)) * 100 : 0,
      formattedValue: formatCurrency(current.freeCashFlow),
      formattedPrevious: formatCurrency(prev.freeCashFlow),
      unit: "$B",
      format: "currency",
      trend: current.freeCashFlow >= prev.freeCashFlow ? "positive" : "negative",
      tooltip: "Operating Cash Flow minus Capital Expenditures; net discretionary liquidity.",
    },
    {
      title: "Debt-to-Equity Ratio",
      key: "debtToEquity",
      value: current.debtToEquity,
      previousValue: prev.debtToEquity,
      changePercent: prev.debtToEquity ? ((current.debtToEquity - prev.debtToEquity) / prev.debtToEquity) * 100 : 0,
      formattedValue: `${current.debtToEquity}x`,
      formattedPrevious: `${prev.debtToEquity}x`,
      unit: "x",
      format: "ratio",
      trend: current.debtToEquity <= prev.debtToEquity ? "positive" : "negative",
      tooltip: "Total debt divided by stockholders' equity; measure of financial leverage.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.key} className="relative hover:border-slate-300 transition-all group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium text-slate-600 truncate">{kpi.title}</span>
              <div className="relative group/tooltip">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-50 pointer-events-none">
                  {kpi.tooltip}
                </div>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">
                {kpi.formattedValue}
              </span>
              <MetricDelta
                changePercent={kpi.changePercent}
                isInverse={kpi.key === "debtToEquity"}
              />
            </div>

            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Prior: {kpi.formattedPrevious}</span>
              <span className="text-[10px] font-mono uppercase bg-slate-100 px-1 py-0.5 rounded text-slate-600">
                FY{current.year}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
