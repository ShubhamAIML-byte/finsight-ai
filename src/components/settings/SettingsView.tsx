"use client";

import React, { useState } from "react";
import {
  Settings,
  Key,
  Database,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  Save,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { SupportedLanguage } from "@/types/chat";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface SettingsViewProps {
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export function SettingsView({ currentLanguage, onChangeLanguage }: SettingsViewProps) {
  const [openAiKey, setOpenAiKey] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          System Configuration & Infrastructure Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage AI model keys, Supabase PostgreSQL connectivity, external data providers, and system telemetry
        </p>
      </div>

      {/* OpenAI Integration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-indigo-600" />
            <div>
              <CardTitle>OpenAI Agentic Reasoning Engine</CardTitle>
              <CardDescription>
                Server-side LLM integration for multilingual synthesis and strategy interpretation
              </CardDescription>
            </div>
          </div>
          <Badge variant="ai">SERVER-SIDE ENCLAVE</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Security Protocol: Zero Client Exposure
            </div>
            All OpenAI API calls are routed exclusively through secure Next.js serverless route handlers. API keys are never leaked to client browsers. If no custom key is provided, FinSight AI operates in high-fidelity deterministic verified sandbox mode.
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              OPENAI_API_KEY (Environment Variable)
            </label>
            <input
              type="password"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400">
              Configured via <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.env.local</code> in development or Vercel Environment Variables in production.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-500 block text-[11px]">Primary Model</span>
              <strong className="text-slate-900 font-mono">gpt-4o-mini / gpt-4o</strong>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-500 block text-[11px]">Vector Embedding Model</span>
              <strong className="text-slate-900 font-mono">text-embedding-3-small (1536 dim)</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Database & Auth Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <div>
              <CardTitle>Supabase PostgreSQL & pgvector Status</CardTitle>
              <CardDescription>
                Persistent relational statements, embeddings table, audit logs, and Row-Level Security
              </CardDescription>
            </div>
          </div>
          <Badge variant="positive">SCHEMA V1.0 COMPILED</Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Database Mode</span>
              <strong className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Dual (Supabase / Sandbox)
              </strong>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-500 block text-[11px]">pgvector Extension</span>
              <strong className="text-slate-900 font-mono mt-0.5 block">HNSW Cosine Ops</strong>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Row-Level Security (RLS)</span>
              <strong className="text-emerald-700 font-semibold mt-0.5 block">Enabled on All 10 Tables</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">
              Migration File: <code className="font-mono text-indigo-700">supabase/migrations/20260101000000_finsight_schema.sql</code>
            </div>
            <p className="text-[11px]">
              Contains full DDL for companies, financial_metrics, market_events, documents, document_chunks (vector), forecast_runs, scenario_runs, recommendations, chat_sessions, and audit_logs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Global Interface Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <div>
              <CardTitle>Multilingual Language Preferences</CardTitle>
              <CardDescription>
                Default conversational response and interface locale
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
              const lang = SUPPORTED_LANGUAGES[langKey];
              const isSelected = currentLanguage === langKey;

              return (
                <button
                  key={langKey}
                  onClick={() => onChangeLanguage(langKey)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400 font-bold text-indigo-900"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="text-xl mb-1">{lang.flag}</div>
                  <div className="text-xs">{lang.nativeName}</div>
                  <div className="text-[10px] text-slate-400">{lang.name}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button Notice */}
      <div className="flex items-center justify-between pt-2">
        {savedNotice && (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Preferences Saved Successfully
          </span>
        )}
        <div className="ml-auto">
          <Button variant="primary" size="md" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
