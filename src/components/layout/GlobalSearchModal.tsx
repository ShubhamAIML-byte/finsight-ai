"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Building2, TrendingUp, ShieldAlert, FileText, ArrowRight } from "lucide-react";
import { COMPANIES } from "@/data/companies";
import { GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";
import { INGESTED_DOCUMENTS } from "@/data/documents";
import { Company } from "@/types/financial";
import { NavSection } from "./Sidebar";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (company: Company) => void;
  onNavigateSection: (section: NavSection) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectCompany,
  onNavigateSection,
}: GlobalSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Keyboard shortcut (Cmd+K / Ctrl+K) listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle logic handled by parent
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase();

  const matchingCompanies = COMPANIES.filter(
    (c) => c.ticker.toLowerCase().includes(term) || c.name.toLowerCase().includes(term)
  );

  const matchingEvents = GEOPOLITICAL_EVENTS.filter(
    (e) => e.headline.toLowerCase().includes(term) || e.summary.toLowerCase().includes(term)
  ).slice(0, 3);

  const matchingDocs = INGESTED_DOCUMENTS.filter(
    (d) => d.title.toLowerCase().includes(term) || d.fileName.toLowerCase().includes(term)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies, financial metrics, geopolitical events, documents..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono bg-slate-200/80 px-2 py-1 rounded text-slate-600 hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 divide-y divide-slate-100">
          {/* Companies */}
          {matchingCompanies.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Companies & Entities
              </div>
              <div className="space-y-1">
                {matchingCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCompany(c);
                      onNavigateSection("company");
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between group text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center font-mono font-bold text-xs text-indigo-700">
                        {c.ticker}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.sector} • Market Cap: ${c.marketCap}B • Health Score: {c.healthScore}/100
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Nav Modules */}
          <div className="pt-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
              Quick Intelligence Modules
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateSection("forecasting");
                  onClose();
                }}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-700 font-medium transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Forecasting Lab
              </button>
              <button
                onClick={() => {
                  onNavigateSection("scenarios");
                  onClose();
                }}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-700 font-medium transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Scenario Simulator
              </button>
              <button
                onClick={() => {
                  onNavigateSection("geopolitical");
                  onClose();
                }}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-700 font-medium transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Geopolitical Alerts
              </button>
              <button
                onClick={() => {
                  onNavigateSection("chat");
                  onClose();
                }}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-700 font-medium transition-colors"
              >
                <FileText className="w-4 h-4 text-violet-600" />
                Multilingual AI Chat
              </button>
            </div>
          </div>

          {/* Geopolitical Events */}
          {matchingEvents.length > 0 && (
            <div className="pt-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Geopolitical & Trade Intelligence
              </div>
              <div className="space-y-1.5">
                {matchingEvents.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onNavigateSection("geopolitical");
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors flex items-start gap-2.5"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 line-clamp-1">{e.headline}</div>
                      <div className="text-[11px] text-slate-500">{e.source} • {e.publicationDate}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {matchingDocs.length > 0 && (
            <div className="pt-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Documents & 10-K Filings
              </div>
              <div className="space-y-1.5">
                {matchingDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onNavigateSection("documents");
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{d.title}</div>
                        <div className="text-[11px] text-slate-500">{d.fileName} • {d.reportingPeriod}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">INDEXED</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
