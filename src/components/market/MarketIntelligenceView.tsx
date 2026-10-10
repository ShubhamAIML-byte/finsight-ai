"use client";

import React, { useState } from "react";
import { Globe2, Search, Filter, ShieldAlert, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { GeopoliticalEvent, MacroIndicator } from "@/types/intelligence";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface MarketIntelligenceViewProps {
  indicators: MacroIndicator[];
  events: GeopoliticalEvent[];
}

export function MarketIntelligenceView({
  indicators,
  events,
}: MarketIntelligenceViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEvent, setActiveEvent] = useState<GeopoliticalEvent | null>(null);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "trade_policy", label: "Trade Policy & BIS" },
    { id: "tariff", label: "Tariffs & CBAM" },
    { id: "foreign_exchange", label: "FX & Settlements" },
    { id: "regulation", label: "FDA / Regulatory" },
    { id: "supply_chain", label: "Supply Chain & Logistics" },
  ];

  const filteredEvents = events.filter((e) => {
    const matchesCat = selectedCategory === "all" || e.category === selectedCategory;
    const matchesQuery =
      e.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.relatedCompanies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Global Macroeconomic & Regulatory Intelligence Hub
            <Badge variant="positive">LIVE VERIFIED FEEDS</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sovereign rate benches, currency volatility indices, and trade regulation tracking
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Source Provider: <span className="font-semibold text-slate-700">BIS, Federal Reserve, ECB, Bureau of Labor Statistics</span>
        </div>
      </div>

      {/* Macro Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((ind) => (
          <Card key={ind.id} className="p-4 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-slate-600 truncate">{ind.name}</span>
              <span className="text-[10px] font-mono uppercase bg-slate-100 px-1 py-0.5 rounded text-slate-500">
                {ind.code}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-1">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {ind.currentValue}
                {ind.unit}
              </span>
              <span
                className={`text-xs font-bold font-mono inline-flex items-center gap-0.5 ${
                  ind.changePercent >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {ind.changePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                {Math.abs(ind.changePercent)}%
              </span>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Prev: {ind.previousValue}{ind.unit}</span>
              <span>Updated: {ind.lastUpdated}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === c.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, tickers..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-60 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="p-5 hover:border-slate-300 hover:shadow-subtle transition-all cursor-pointer"
            onClick={() => setActiveEvent(event)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    event.severity === "critical"
                      ? "negative"
                      : event.severity === "high"
                      ? "warning"
                      : "neutral"
                  }
                >
                  {event.severity.toUpperCase()}
                </Badge>
                <span className="text-xs font-semibold uppercase text-slate-500 font-mono">
                  {event.category.replace(/_/g, " ")}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {event.source} • {event.publicationDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Impacted Entities:</span>
                <div className="flex gap-1">
                  {event.relatedCompanies.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-200/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
              {event.headline}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {event.summary}
            </p>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-700">
                <strong className="text-slate-900">Projected Financial Impact:</strong>{" "}
                {event.potentialFinancialImpact}
              </div>
              <span className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 shrink-0">
                View Event Brief <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Detail Modal / Drawer */}
      {activeEvent && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <Badge
                variant={
                  activeEvent.severity === "critical"
                    ? "negative"
                    : activeEvent.severity === "high"
                    ? "warning"
                    : "neutral"
                }
              >
                {activeEvent.severity.toUpperCase()} IMPACT
              </Badge>
              <button
                onClick={() => setActiveEvent(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close (ESC)
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {activeEvent.headline}
            </h3>

            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {activeEvent.summary}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Publication Source</span>
                <span className="font-semibold text-slate-800">{activeEvent.source}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Publication Date</span>
                <span className="font-mono text-slate-800">{activeEvent.publicationDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Confidence Level</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {(activeEvent.confidenceLevel * 100).toFixed(0)}% Sourced
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Affected Regions</span>
                <span className="text-slate-800">{activeEvent.affectedRegions.join(", ")}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActiveEvent(null)}>
                Dismiss Brief
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
