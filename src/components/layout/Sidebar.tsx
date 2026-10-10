"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  Globe2,
  ShieldAlert,
  TrendingUp,
  Sliders,
  Lightbulb,
  Sparkles,
  MessageSquareCode,
  FolderLock,
  Settings,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSection =
  | "overview"
  | "company"
  | "statements"
  | "market"
  | "geopolitical"
  | "forecasting"
  | "scenarios"
  | "recommendations"
  | "explainability"
  | "chat"
  | "documents"
  | "settings";

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "company", label: "Company Intelligence", icon: Building2 },
    { id: "statements", label: "Financial Statements", icon: FileSpreadsheet },
    { id: "market", label: "Market Intelligence", icon: Globe2 },
    { id: "geopolitical", label: "Geopolitical Risk", icon: ShieldAlert, badge: "Live" },
    { id: "forecasting", label: "Forecasting Lab", icon: TrendingUp },
    { id: "scenarios", label: "Scenario Simulator", icon: Sliders },
    { id: "recommendations", label: "AI Recommendations", icon: Lightbulb, badge: "3" },
    { id: "explainability", label: "Explainable AI", icon: Sparkles },
    { id: "chat", label: "Multilingual AI Chat", icon: MessageSquareCode, badge: "AI" },
    { id: "documents", label: "Document Library", icon: FolderLock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-navy-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 select-none shrink-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-900/40">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  FinSight <span className="text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/50">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Institutional OS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-lg transition-all duration-150 group text-sm font-medium",
                  isCollapsed ? "justify-center px-0 py-2.5" : "px-3 py-2 justify-between",
                  isActive
                    ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider",
                      item.badge === "Live"
                        ? "bg-rose-950 text-rose-400 border border-rose-800/60 animate-pulse"
                        : item.badge === "AI"
                        ? "bg-indigo-950 text-indigo-400 border border-indigo-800/60"
                        : "bg-slate-800 text-slate-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-medium text-slate-300">Agents Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">v1.0.0</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="All agent services active" />
          </div>
        )}
      </div>
    </aside>
  );
}
