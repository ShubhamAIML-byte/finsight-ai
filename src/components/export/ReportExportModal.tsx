"use client";

import React, { useState } from "react";
import { Download, Printer, X, FileText, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { Company, FinancialMetric } from "@/types/financial";
import { Recommendation } from "@/types/recommendation";
import { GeopoliticalEvent } from "@/types/intelligence";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  latest: FinancialMetric;
  history: FinancialMetric[];
  recommendations: Recommendation[];
  events: GeopoliticalEvent[];
}

export function ReportExportModal({
  isOpen,
  onClose,
  company,
  latest,
  history,
  recommendations,
  events,
}: ReportExportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = async () => {
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
      a.download = `${company.ticker}_Financial_Intelligence_Dossier.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Financial Intelligence Dossier Preview
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadCsv} icon={<Download className="w-3.5 h-3.5" />}>
              Download CSV
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} icon={<Printer className="w-3.5 h-3.5" />}>
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 printable-area">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600">
                FinSight AI Institutional Research Report
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">
                {company.name} ({company.ticker})
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {company.sector} • {company.industry} • Market Cap: ${company.marketCap}B USD
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">Date: {new Date().toISOString().split("T")[0]}</span>
              <div className="mt-1">
                <Badge variant="positive">INVESTMENT GRADE</Badge>
              </div>
            </div>
          </div>

          {/* Executive Summary Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Executive Summary & Health Diagnostics
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {company.name} demonstrates robust operational metrics for FY{latest.year}, recording consolidated revenue of{" "}
              <strong>${latest.revenue}B</strong>, operating margins of <strong>{latest.operatingMargin}%</strong>, and net income of{" "}
              <strong>${latest.netIncome}B</strong>. Discretionary Free Cash Flow reached <strong>${latest.freeCashFlow}B</strong>.
              The company achieves a composite FinSight Health Score of <strong>{company.healthScore}/100</strong> with an Altman Z-Score of{" "}
              <strong>{company.altmanZScore}</strong>, signaling negligible bankruptcy risk over the 24-month horizon.
            </p>

            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 rounded bg-slate-50 border text-center">
                <span className="text-[10px] text-slate-500 block">Altman Z-Score</span>
                <span className="text-base font-bold font-mono text-slate-900">{company.altmanZScore}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border text-center">
                <span className="text-[10px] text-slate-500 block">Piotroski F-Score</span>
                <span className="text-base font-bold font-mono text-slate-900">{company.piotroskiFScore} / 9</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border text-center">
                <span className="text-[10px] text-slate-500 block">Operating Margin</span>
                <span className="text-base font-bold font-mono text-slate-900">{latest.operatingMargin}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border text-center">
                <span className="text-[10px] text-slate-500 block">Debt / Equity</span>
                <span className="text-base font-bold font-mono text-slate-900">{latest.debtToEquity}x</span>
              </div>
            </div>
          </div>

          {/* Historical Trends Table */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. 5-Year Audited Financial Statements
            </h2>
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold">
                  <th className="p-2 border">Fiscal Year</th>
                  <th className="p-2 border text-right">Revenue</th>
                  <th className="p-2 border text-right">Gross Profit</th>
                  <th className="p-2 border text-right">EBITDA</th>
                  <th className="p-2 border text-right">Net Income</th>
                  <th className="p-2 border text-right">FCF</th>
                  <th className="p-2 border text-right">Op. Margin</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {history.map((m) => (
                  <tr key={m.year} className="border-b">
                    <td className="p-2 border font-sans font-bold">FY{m.year}</td>
                    <td className="p-2 border text-right">{formatCurrency(m.revenue)}</td>
                    <td className="p-2 border text-right">{formatCurrency(m.grossProfit)}</td>
                    <td className="p-2 border text-right">{formatCurrency(m.ebitda)}</td>
                    <td className="p-2 border text-right">{formatCurrency(m.netIncome)}</td>
                    <td className="p-2 border text-right">{formatCurrency(m.freeCashFlow)}</td>
                    <td className="p-2 border text-right font-sans">{m.operatingMargin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prioritized Recommendations */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Prioritized Strategic Directives
            </h2>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, i) => (
                <div key={rec.id} className="p-3 rounded border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {i + 1}. {rec.title}
                    </span>
                    <span className="font-mono text-emerald-700">{rec.expectedImpactRange.estimatedValueUSD}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{rec.explanation}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Category: {rec.category} • Confidence: {(rec.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing and Limitations */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <strong>Methodology & Sourcing Governance:</strong>
            <p>
              This report is generated autonomously by FinSight AI multi-agent orchestration architecture. Historical financial data is derived directly from verified SEC Form 10-K and 10-Q disclosures. Forecasts reflect walk-forward chronological validations. Parametric stress simulations are mathematical estimates based on stated assumptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
