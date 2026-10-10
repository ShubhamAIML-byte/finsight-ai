"use client";

import React from "react";
import { X, ShieldAlert, TrendingDown, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRisk: () => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  onNavigateToRisk,
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Intelligence Alerts & Spikes</h2>
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {GEOPOLITICAL_EVENTS.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-subtle transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-1.5">
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
                  <span className="text-[11px] text-slate-400">{event.publicationDate}</span>
                </div>

                <h4 className="text-xs font-semibold text-slate-900 leading-snug mb-1">
                  {event.headline}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                  {event.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-medium">Source: {event.source}</span>
                  <span className="text-slate-700 font-mono font-medium">
                    {event.relatedCompanies.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onNavigateToRisk();
                onClose();
              }}
              className="w-full justify-center"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Full Geopolitical Matrix
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
