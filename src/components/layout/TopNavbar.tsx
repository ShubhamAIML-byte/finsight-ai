"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Globe,
  Download,
  Building,
  Check,
  ChevronDown,
  User,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Company } from "@/types/financial";
import { SupportedLanguage } from "@/types/chat";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { Button } from "../common/Button";

interface TopNavbarProps {
  companies: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenExportReport: () => void;
  hasUnreadAlerts?: boolean;
}

export function TopNavbar({
  companies,
  selectedCompany,
  onSelectCompany,
  currentLanguage,
  onChangeLanguage,
  onOpenSearch,
  onOpenNotifications,
  onOpenExportReport,
  hasUnreadAlerts = true,
}: TopNavbarProps) {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Company Selector & Quick Search */}
      <div className="flex items-center gap-4">
        {/* Company Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCompanyDropdown(!showCompanyDropdown);
              setShowLangDropdown(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors bg-white text-left shadow-sm group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-xs font-bold text-indigo-700">
              {selectedCompany.ticker.slice(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {selectedCompany.ticker}
              </span>
              <span className="text-[11px] text-slate-500 max-w-[130px] truncate">
                {selectedCompany.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-1" />
          </button>

          {showCompanyDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Select Enterprise Entity
              </div>
              {companies.map((c) => {
                const isSelected = c.ticker === selectedCompany.ticker;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCompany(c);
                      setShowCompanyDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-slate-100 font-mono font-bold text-[11px] flex items-center justify-center text-slate-700">
                        {c.ticker}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.sector} • ${c.marketCap}B</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-all w-60 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Search metrics, docs, risks...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Data Freshness, Export, Language, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Data Freshness Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">DEMO SANDBOX</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Live Feeds Synchronized</span>
        </div>

        {/* Report Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenExportReport}
          icon={<Download className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          Export Dossier
        </Button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowCompanyDropdown(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{SUPPORTED_LANGUAGES[currentLanguage].flag}</span>
            <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[currentLanguage].nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 border-b border-slate-100 text-[10px] uppercase font-semibold text-slate-400">
                Interface & AI Language
              </div>
              {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                const lang = SUPPORTED_LANGUAGES[langKey];
                const isSelected = currentLanguage === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => {
                      onChangeLanguage(langKey);
                      setShowLangDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span className="font-medium text-slate-800">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">({lang.name})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          aria-label="View risk notifications"
          className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowCompanyDropdown(false);
              setShowLangDropdown(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100">
              FA
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">Financial Analyst (Sandbox)</div>
                <div className="text-[11px] text-slate-500">analyst@finsight-ai.internal</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Supabase Auth Ready
                </div>
              </div>

              <div className="p-1">
                <div className="px-2 py-1.5 text-slate-500 text-[11px]">
                  Role: Senior Investment Principal
                </div>
                <div className="px-2 py-1.5 text-slate-500 text-[11px]">
                  Workspace: Global Multinationals Portfolio
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
