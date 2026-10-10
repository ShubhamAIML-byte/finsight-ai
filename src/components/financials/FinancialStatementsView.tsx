"use client";

import React, { useState } from "react";
import { Download, Search, FileSpreadsheet, Upload, ArrowUpDown } from "lucide-react";
import { Company, FinancialMetric } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Button } from "../common/Button";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface FinancialStatementsViewProps {
  company: Company;
  history: FinancialMetric[];
  onOpenUpload: () => void;
}

type StatementTab = "income" | "balance" | "cashflow" | "ratios";

export function FinancialStatementsView({
  company,
  history,
  onOpenUpload,
}: FinancialStatementsViewProps) {
  const [activeTab, setActiveTab] = useState<StatementTab>("income");
  const [filterQuery, setFilterQuery] = useState("");

  const years = history.map((h) => h.year).sort((a, b) => a - b);

  // Group metrics by statement category
  const statementDefinitions: Record<
    StatementTab,
    { label: string; key: keyof FinancialMetric; format: "currency" | "percent" | "ratio" }[]
  > = {
    income: [
      { label: "Consolidated Revenue", key: "revenue", format: "currency" },
      { label: "Cost of Goods Sold (COGS)", key: "cogs", format: "currency" },
      { label: "Gross Profit", key: "grossProfit", format: "currency" },
      { label: "Operating Expenses (OPEX)", key: "operatingExpenses", format: "currency" },
      { label: "EBITDA", key: "ebitda", format: "currency" },
      { label: "Operating Income (EBIT)", key: "ebit", format: "currency" },
      { label: "Interest Expense", key: "interestExpense", format: "currency" },
      { label: "Income Tax Expense", key: "taxExpense", format: "currency" },
      { label: "Net Income (Profit)", key: "netIncome", format: "currency" },
      { label: "Earnings Per Share (EPS)", key: "eps", format: "ratio" },
    ],
    balance: [
      { label: "Cash & Cash Equivalents", key: "cashAndEquivalents", format: "currency" },
      { label: "Current Assets", key: "currentAssets", format: "currency" },
      { label: "Total Assets", key: "totalAssets", format: "currency" },
      { label: "Current Liabilities", key: "currentLiabilities", format: "currency" },
      { label: "Total Debt (Short + Long)", key: "totalDebt", format: "currency" },
      { label: "Total Liabilities", key: "totalLiabilities", format: "currency" },
      { label: "Stockholders' Equity", key: "stockholdersEquity", format: "currency" },
      { label: "Shares Outstanding (Diluted)", key: "sharesOutstanding", format: "ratio" },
    ],
    cashflow: [
      { label: "Cash from Operations (OCF)", key: "operatingCashFlow", format: "currency" },
      { label: "Capital Expenditures (CapEx)", key: "capitalExpenditures", format: "currency" },
      { label: "Free Cash Flow (FCF)", key: "freeCashFlow", format: "currency" },
    ],
    ratios: [
      { label: "Gross Margin", key: "grossMargin", format: "percent" },
      { label: "Operating Margin", key: "operatingMargin", format: "percent" },
      { label: "Net Margin", key: "netMargin", format: "percent" },
      { label: "EBITDA Margin", key: "ebitdaMargin", format: "percent" },
      { label: "Return on Equity (ROE)", key: "roe", format: "percent" },
      { label: "Return on Assets (ROA)", key: "roa", format: "percent" },
      { label: "Debt-to-Equity Ratio", key: "debtToEquity", format: "ratio" },
      { label: "Current Ratio (Liquidity)", key: "currentRatio", format: "ratio" },
      { label: "Asset Turnover", key: "assetTurnover", format: "ratio" },
    ],
  };

  const currentRows = statementDefinitions[activeTab].filter((row) =>
    row.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const downloadCsv = async () => {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: company.ticker, format: "csv" }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${company.ticker}_Financial_Statements.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to export CSV:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Statement Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          {(
            [
              { id: "income", label: "Income Statement" },
              { id: "balance", label: "Balance Sheet" },
              { id: "cashflow", label: "Cash Flow" },
              { id: "ratios", label: "Financial Ratios" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter line items..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-48 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button variant="outline" size="sm" onClick={downloadCsv} icon={<Download className="w-3.5 h-3.5" />}>
            Export CSV
          </Button>

          <Button variant="primary" size="sm" onClick={onOpenUpload} icon={<Upload className="w-3.5 h-3.5" />}>
            Upload Filing
          </Button>
        </div>
      </Card>

      {/* Main Statement Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="capitalize">
              {company.name} ({company.ticker}) — {activeTab.replace(/_/g, " ")} Breakdown
            </CardTitle>
            <CardDescription>
              All figures denominated in USD Billions (unless indicated as % or Ratio). Audited from verified disclosures.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-6 min-w-[240px]">Line Item Description</th>
                {years.map((yr) => (
                  <th key={yr} className="p-3.5 text-right font-mono">
                    FY{yr}
                  </th>
                ))}
                <th className="p-3.5 pr-6 text-right font-mono">5Y Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentRows.map((row) => {
                const values = years.map((yr) => {
                  const m = history.find((h) => h.year === yr);
                  return m ? (m[row.key] as number) : 0;
                });
                const firstVal = values[0];
                const lastVal = values[values.length - 1];
                const changePct = firstVal !== 0 ? ((lastVal - firstVal) / Math.abs(firstVal)) * 100 : 0;

                const formatValue = (val: number) => {
                  if (row.format === "percent") return formatPercent(val);
                  if (row.format === "ratio") return `${val.toFixed(2)}${row.key === "eps" ? "$" : "x"}`;
                  return formatCurrency(val);
                };

                return (
                  <tr key={row.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-6 font-sans font-medium text-slate-800">
                      {row.label}
                    </td>
                    {values.map((v, i) => (
                      <td key={i} className="p-3.5 text-right text-slate-700">
                        {formatValue(v)}
                      </td>
                    ))}
                    <td className="p-3.5 pr-6 text-right font-sans">
                      <span
                        className={`text-[11px] font-semibold ${
                          changePct >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {changePct >= 0 ? "+" : ""}
                        {changePct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
