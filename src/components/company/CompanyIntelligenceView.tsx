"use client";

import React from "react";
import { Building2, Globe, TrendingUp, ShieldCheck, DollarSign, BarChart3, ArrowRight } from "lucide-react";
import { Company, FinancialMetric } from "@/types/financial";
import { COMPANIES } from "@/data/companies";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface CompanyIntelligenceViewProps {
  company: Company;
  history: FinancialMetric[];
  onSelectCompany: (company: Company) => void;
  onNavigateToStatements: () => void;
}

export function CompanyIntelligenceView({
  company,
  history,
  onSelectCompany,
  onNavigateToStatements,
}: CompanyIntelligenceViewProps) {
  const latest = history[history.length - 1];
  const peers = COMPANIES.filter((c) => c.ticker !== company.ticker);

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border-none shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center font-mono font-extrabold text-2xl text-white shadow-inner">
              {company.ticker}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">{company.name}</h1>
                <Badge variant="positive" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  HEALTH SCORE {company.healthScore}/100
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {company.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span>Sector: <strong className="text-white">{company.sector}</strong></span>
                <span>•</span>
                <span>Industry: <strong className="text-white">{company.industry}</strong></span>
                <span>•</span>
                <span>HQ: <strong className="text-white">{company.country}</strong></span>
                <span>•</span>
                <span>Reporting Currency: <strong className="text-white">{company.currency}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <span className="text-xs text-slate-400">Market Capitalization</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ${company.marketCap}B
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Enterprise Scale • Beta {company.beta}
            </span>
          </div>
        </div>
      </Card>

      {/* Core Valuation & Trading Multiples Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">P/E Ratio (TTM)</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{company.peRatio}x</div>
          <span className="text-[10px] text-slate-400">Sector avg: 28.4x</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">Dividend Yield</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{company.dividendYield}%</div>
          <span className="text-[10px] text-slate-400">Annual payout</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">Beta (5Y Monthly)</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{company.beta}</div>
          <span className="text-[10px] text-slate-400">{company.beta > 1 ? "Aggressive" : "Defensive"}</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">Altman Z-Score</span>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-1">{company.altmanZScore}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Safe Zone (&gt;2.99)</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">Piotroski F-Score</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">{company.piotroskiFScore} / 9</div>
          <span className="text-[10px] text-slate-400">High operational quality</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-slate-500 font-medium">Operating Margin</span>
          <div className="text-lg font-bold font-mono text-indigo-600 mt-1">{latest.operatingMargin}%</div>
          <span className="text-[10px] text-slate-400">Gross: {latest.grossMargin}%</span>
        </Card>
      </div>

      {/* Multi-Year Overview Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>5-Year Historical Performance Metrics Summary</CardTitle>
            <CardDescription>
              Normalized audited figures (FY2021 – FY{latest.year}) from verified SEC Form 10-K filings
            </CardDescription>
          </div>
          <button
            onClick={onNavigateToStatements}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Open Statements Table
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-5">Fiscal Year</th>
                <th className="p-3.5">Revenue</th>
                <th className="p-3.5">Gross Profit</th>
                <th className="p-3.5">EBITDA</th>
                <th className="p-3.5">Net Profit</th>
                <th className="p-3.5">Operating Margin</th>
                <th className="p-3.5">FCF</th>
                <th className="p-3.5 pr-5">Debt / Equity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {history.map((m) => (
                <tr key={m.year} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-900">FY{m.year}</td>
                  <td className="p-3.5 text-slate-800">{formatCurrency(m.revenue)}</td>
                  <td className="p-3.5 text-slate-700">{formatCurrency(m.grossProfit)}</td>
                  <td className="p-3.5 text-slate-700">{formatCurrency(m.ebitda)}</td>
                  <td className="p-3.5 font-semibold text-emerald-600">{formatCurrency(m.netIncome)}</td>
                  <td className="p-3.5 text-indigo-600 font-semibold">{m.operatingMargin}%</td>
                  <td className="p-3.5 text-slate-700">{formatCurrency(m.freeCashFlow)}</td>
                  <td className="p-3.5 pr-5 text-slate-700">{m.debtToEquity}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Peer Comparison Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Cross-Sector Institutional Peer Benchmarks</CardTitle>
            <CardDescription>
              Comparative valuation multiples, margins, and financial health scores against other tracking entities
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5 pl-5">Ticker</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Sector</th>
                <th className="p-3.5">Market Cap</th>
                <th className="p-3.5">P/E Ratio</th>
                <th className="p-3.5">Health Score</th>
                <th className="p-3.5">Altman Z</th>
                <th className="p-3.5 pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPANIES.map((c) => {
                const isSelected = c.ticker === company.ticker;
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? "bg-indigo-50/40 font-medium" : ""
                    }`}
                  >
                    <td className="p-3.5 pl-5 font-mono font-bold text-slate-900">
                      {c.ticker}
                      {isSelected && (
                        <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-sans">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-800">{c.name}</td>
                    <td className="p-3.5 text-slate-600">{c.sector}</td>
                    <td className="p-3.5 font-mono text-slate-800">${c.marketCap}B</td>
                    <td className="p-3.5 font-mono text-slate-800">{c.peRatio}x</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.healthScore}/100
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-800">{c.altmanZScore}</td>
                    <td className="p-3.5 pr-5">
                      {!isSelected && (
                        <button
                          onClick={() => onSelectCompany(c)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Switch Entity
                        </button>
                      )}
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
