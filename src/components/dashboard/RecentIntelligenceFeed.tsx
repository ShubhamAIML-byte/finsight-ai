"use client";

import React from "react";
import { Globe, ArrowRight, ShieldAlert, ExternalLink } from "lucide-react";
import { GeopoliticalEvent, MacroIndicator } from "@/types/intelligence";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface RecentIntelligenceFeedProps {
  events: GeopoliticalEvent[];
  indicators: MacroIndicator[];
  onNavigateToMarket: () => void;
}

export function RecentIntelligenceFeed({
  events,
  indicators,
  onNavigateToMarket,
}: RecentIntelligenceFeedProps) {
  const topIndicators = indicators.slice(0, 4);
  const topEvents = events.slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <div>
            <CardTitle>Market & Geopolitical Intelligence Feed</CardTitle>
            <CardDescription>
              Macro indicators and verified regulatory policy developments
            </CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToMarket}
          className="text-xs text-indigo-600 hover:text-indigo-700"
        >
          Intelligence Hub
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Quick Macro Ticker Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {topIndicators.map((ind) => (
            <div
              key={ind.id}
              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                {ind.name}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-bold font-mono text-slate-900">
                  {ind.currentValue}
                  {ind.unit}
                </span>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    ind.changePercent > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {ind.changePercent > 0 ? "+" : ""}
                  {ind.changePercent}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events List */}
        <div className="space-y-2.5 pt-1">
          {topEvents.map((e) => (
            <div
              key={e.id}
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-start gap-3"
            >
              <div className="mt-0.5">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    e.severity === "critical"
                      ? "text-rose-600"
                      : e.severity === "high"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      e.severity === "critical"
                        ? "negative"
                        : e.severity === "high"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {e.severity.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {e.publicationDate} • {e.source}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                  {e.headline}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {e.potentialFinancialImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
