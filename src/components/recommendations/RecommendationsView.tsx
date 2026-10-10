"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Company } from "@/types/financial";
import { Recommendation, RecommendationCategory, RecommendationPriority, RecommendationStatus } from "@/types/recommendation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface RecommendationsViewProps {
  company: Company;
  recommendations: Recommendation[];
  onOpenExportReport: () => void;
}

export function RecommendationsView({
  company,
  recommendations: initialRecommendations,
  onOpenExportReport,
}: RecommendationsViewProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  const filtered = recommendations.filter((r) => {
    const matchesCompany = r.companyTicker === company.ticker;
    const matchesPriority = selectedPriority === "all" || r.priority === selectedPriority;
    const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
    return matchesCompany && matchesPriority && matchesCategory;
  });

  const handleUpdateStatus = async (id: string, newStatus: RecommendationStatus) => {
    try {
      await fetch("/api/recommendations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error("Failed to update recommendation status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            AI Strategic Recommendation Center
            <Badge variant="ai">GROUNDED DIRECTIVES</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized capital allocation, risk mitigation, and operational initiatives for {company.name} ({company.ticker})
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onOpenExportReport}>
          Export Recommendations PDF
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Priority:</span>
          {["all", "critical", "high", "medium"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                selectedPriority === p
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="risk_mitigation">Risk Mitigation</option>
            <option value="cost_optimization">Cost Optimization</option>
            <option value="market_expansion">Market Expansion</option>
            <option value="capital_allocation">Capital Allocation</option>
            <option value="pricing_strategy">Pricing Strategy</option>
          </select>
        </div>
      </Card>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isExpanded = expandedRecId === rec.id;

          return (
            <Card
              key={rec.id}
              className={`p-5 transition-all ${
                isExpanded ? "ring-1 ring-indigo-400 shadow-md" : "hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge
                      variant={
                        rec.priority === "critical"
                          ? "negative"
                          : rec.priority === "high"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {rec.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                      {rec.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">
                      Status:{" "}
                      <strong className="text-slate-800 capitalize">{rec.status.replace(/_/g, " ")}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {rec.title}
                  </h3>
                </div>

                {/* Impact Badge */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Expected Impact
                  </span>
                  <div className="text-base font-extrabold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 mt-0.5">
                    {rec.expectedImpactRange.estimatedValueUSD}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {rec.expectedImpactRange.impactMetric}
                  </span>
                </div>
              </div>

              {/* Business Objective & Narrative */}
              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 my-3">
                <span className="font-semibold text-slate-900 block mb-1">
                  Objective: {rec.businessObjective}
                </span>
                {rec.explanation}
              </div>

              {/* Supporting Metrics Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3">
                {rec.supportingMetrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg border border-slate-200/80 bg-white text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-500">{m.label}</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">{m.value}</span>
                      <span className="text-[10px] text-emerald-600 ml-1.5 font-semibold font-mono">
                        {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable Implementation Phases */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Structured Implementation Roadmap
                    </h4>
                    <div className="space-y-2">
                      {rec.implementationSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                              <span>{step.phase}</span>
                              <span className="text-[11px] font-mono text-slate-500">{step.timeline}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{step.action}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Owner: {step.ownerDepartment}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks & Grounded Sources */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/60">
                      <span className="font-bold text-rose-800 block mb-1">Execution Risks:</span>
                      <ul className="list-disc list-inside text-[11px] text-rose-700 space-y-1">
                        {rec.potentialRisks.map((risk, i) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-1">Verifiable References:</span>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        {rec.sourceReferences.map((ref, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>
                              {ref.title} ({ref.type} • {ref.date})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Controls */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    Confidence:{" "}
                    <strong className="text-slate-900 font-mono font-bold">
                      {(rec.confidenceScore * 100).toFixed(0)}%
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-[11px]">{rec.confidenceRationale}</span>
                </div>

                <div className="flex items-center gap-2">
                  {rec.status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(rec.id, "approved")}
                    >
                      Approve Directive
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {isExpanded ? (
                      <>
                        Collapse Roadmap <ChevronUp className="w-3.5 h-3.5 ml-1" />
                      </>
                    ) : (
                      <>
                        Expand Roadmap <ChevronDown className="w-3.5 h-3.5 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
