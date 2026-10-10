"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Globe, FileCheck, ArrowRight, ExternalLink } from "lucide-react";
import { Company } from "@/types/financial";
import { GeopoliticalEvent } from "@/types/intelligence";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { RiskRadarChart } from "../dashboard/RiskRadarChart";
import { Button } from "../common/Button";

interface GeopoliticalRiskViewProps {
  company: Company;
  events: GeopoliticalEvent[];
  onNavigateToScenarios: () => void;
}

export function GeopoliticalRiskView({
  company,
  events,
  onNavigateToScenarios,
}: GeopoliticalRiskViewProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const companyEvents = events.filter((e) =>
    e.relatedCompanies.includes(company.ticker) || e.relatedIndustries.includes(company.industry)
  );

  const filtered = companyEvents.filter(
    (e) => severityFilter === "all" || e.severity === severityFilter
  );

  return (
    <div className="space-y-6">
      {/* Risk Overview Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-rose-950 via-slate-900 to-navy-950 text-white border-none shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="negative" className="bg-rose-500/20 text-rose-300 border-rose-500/40">
                  GEOPOLITICAL THREAT MATRIX
                </Badge>
                <h1 className="text-xl font-bold tracking-tight text-white mt-2">
                  Trade Restrictions & Supply Chain Vulnerability
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Active monitoring of bilateral export classifications, carbon border adjustment levies (CBAM), and maritime transport corridor security affecting {company.name}.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Threat Vulnerability</span>
                <div className="text-3xl font-extrabold font-mono text-rose-400 mt-0.5">
                  68 <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
                <span className="text-[10px] text-rose-300 font-medium">Elevated Cross-Border Risk</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400">Tariff Exposure</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">18.5% Headwind</div>
              </div>
              <div>
                <span className="text-slate-400">Supply Nearshoring Status</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">32% Diversified</div>
              </div>
              <div>
                <span className="text-slate-400">Active Regulatory Orders</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">4 Direct Injunctions</div>
              </div>
            </div>
          </Card>

          {/* Action Trigger Card */}
          <Card className="p-4 bg-amber-50/60 border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Stress Test Tariff Escalation</h4>
                <p className="text-[11px] text-slate-600">
                  Simulate up to 35% tariff surcharges and supply chain friction on {company.ticker} EBITDA in Scenario Simulator.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToScenarios}
              className="bg-white hover:bg-amber-100/50 border-amber-300 text-amber-900 font-semibold"
            >
              Simulate Shocks
            </Button>
          </Card>
        </div>

        {/* Risk Radar Chart */}
        <div className="lg:col-span-1">
          <RiskRadarChart companyTicker={company.ticker} />
        </div>
      </div>

      {/* Filter and Event Cards */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Direct Geopolitical & Regulatory Filings ({filtered.length})</CardTitle>
            <CardDescription>
              Verified intelligence entries referencing {company.ticker} or its immediate tier-1 supplier ecosystem
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {["all", "critical", "high", "medium"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  severityFilter === sev
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-subtle transition-all bg-white"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.severity === "critical"
                        ? "negative"
                        : item.severity === "high"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {item.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                    {item.category.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{item.publicationDate}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                {item.headline}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="p-2 rounded bg-slate-50 text-slate-700">
                  <span className="text-slate-500 font-medium">Estimated Financial Exposure: </span>
                  <strong className="text-slate-900">{item.potentialFinancialImpact}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 text-slate-700 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Source Documentation:</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    {item.source} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
