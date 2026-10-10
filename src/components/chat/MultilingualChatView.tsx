"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  Layers,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { Company } from "@/types/financial";
import { ChatMessage, SupportedLanguage } from "@/types/chat";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface MultilingualChatViewProps {
  company: Company;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onSelectCompany: (company: Company) => void;
}

export function MultilingualChatView({
  company,
  language,
  onChangeLanguage,
  onSelectCompany,
}: MultilingualChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: SUPPORTED_LANGUAGES[language].welcomeGreeting,
      timestamp: new Date().toISOString(),
      detectedLanguage: language,
      companyContext: company.ticker,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepText, setActiveStepText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in the active language
  const suggestedQueries: Record<SupportedLanguage, string[]> = {
    en: [
      `Why is ${company.ticker}'s operating margin at its current level?`,
      `How would a 20% tariff increase affect ${company.name}'s profitability?`,
      `What are the top geopolitical and trade risks for ${company.ticker}?`,
      `What prioritized strategic initiatives should the board execute?`,
    ],
    hi: [
      `${company.ticker} का ऑपरेटिंग मार्जिन क्या है और इसके मुख्य चालक कौन हैं?`,
      `20% टैरिफ वृद्धि से ${company.name} की लाभप्रदता पर क्या प्रभाव पड़ेगा?`,
      `${company.ticker} के लिए प्रमुख भू-राजनीतिक जोखिम क्या हैं?`,
      `प्रबंधन को किन रणनीतिक सिफारिशों को प्राथमिकता देनी चाहिए?`,
    ],
    bn: [
      `${company.ticker}-এর অপারেটিং মার্জিন কত এবং এর মূল কারণ কী?`,
      `২০% শুল্ক বৃদ্ধি ${company.name}-এর মুনাফায় কী প্রভাব ফেলবে?`,
      `${company.ticker}-এর জন্য প্রধান ভূ-রাজনৈতিক ঝুঁকিগুলি কী?`,
      `বোর্ড অফ ডিরেক্টরসের কোন কৌশলগত পদক্ষেপে অগ্রাধিকার দেওয়া উচিত?`,
    ],
    es: [
      `¿Por qué se sitúa el margen operativo de ${company.ticker} en su nivel actual?`,
      `¿Cómo afectaría un arancel del 20% a la rentabilidad de ${company.name}?`,
      `¿Cuáles son los principales riesgos geopolíticos para ${company.ticker}?`,
      `¿Qué recomendaciones estratégicas debe priorizar la dirección?`,
    ],
    fr: [
      `Pourquoi la marge opérationnelle de ${company.ticker} est-elle à ce niveau ?`,
      `Quel sera l'impact d'une hausse tarifaire de 20% sur ${company.name} ?`,
      `Quels sont les principaux risques géopolitiques pour ${company.ticker} ?`,
      `Quelles recommandations stratégiques le conseil d'administration doit-il prioriser ?`,
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
      companyContext: company.ticker,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    // Simulate Agent Step Progress indicator
    setActiveStepText("Financial Analysis Agent: Inspecting Form 10-K statements...");
    const t1 = setTimeout(() => {
      setActiveStepText("Geopolitical Risk Agent: Scanning tariff mandates & BIS classifications...");
    }, 450);
    const t2 = setTimeout(() => {
      setActiveStepText("Forecasting & Recommendation Agent: Synthesizing verified directives...");
    }, 900);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          language,
          companyTicker: company.ticker,
        }),
      });

      const data = await response.json();

      clearTimeout(t1);
      clearTimeout(t2);

      if (response.ok && data.answer) {
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
          detectedLanguage: data.language || language,
          companyContext: company.ticker,
          citations: data.citations,
          agentExecutionSteps: data.agentExecutionSteps,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `Unable to complete agent synthesis: ${data.error || "Internal Error"}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "Network error connecting to FinSight Agent Orchestrator.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setActiveStepText("");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* Chat Top Banner with Language & Context Selection */}
      <Card className="p-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            {company.ticker}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Active Context: {company.name} ({company.ticker})
            </h3>
            <span className="text-[10px] text-slate-500">
              Health: {company.healthScore}/100 • Altman Z: {company.altmanZScore} • FY2025 Audited 10-K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Language:</span>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-none"
          >
            {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => (
              <option key={langKey} value={langKey}>
                {SUPPORTED_LANGUAGES[langKey].flag} {SUPPORTED_LANGUAGES[langKey].nativeName}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl space-y-2 ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-slate-900 text-white rounded-tr-none shadow-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-card"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Citations & Evidence Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      Grounded Sources & SEC Evidence ({msg.citations.length})
                    </span>
                    <div className="space-y-1.5">
                      {msg.citations.map((cite) => (
                        <div
                          key={cite.id}
                          className="p-2 rounded bg-white border border-slate-200/80 text-slate-600 leading-snug"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                            <span>{cite.title}</span>
                            <span className="text-[10px] text-emerald-600 font-mono">
                              {cite.relevancePercent}% Match
                            </span>
                          </div>
                          <span className="italic text-slate-500">&ldquo;{cite.snippet}&rdquo;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agent Execution Pipeline Inspector */}
                {!isUser && msg.agentExecutionSteps && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200/60 text-[11px]">
                    <div className="flex items-center justify-between text-indigo-900 font-bold mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                        Autonomous Multi-Agent Trace Pipeline
                      </span>
                      <span className="text-[10px] font-mono text-indigo-600">
                        {msg.agentExecutionSteps.length} Steps Verified
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {msg.agentExecutionSteps.map((s) => (
                        <div
                          key={s.id}
                          className="p-1.5 rounded bg-white border border-indigo-100 flex items-center gap-1.5 truncate"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate text-slate-700 font-medium text-[10px]">
                            {s.agentName.replace(" Agent", "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Agent Thinking Step State */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-card text-xs text-indigo-700 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>FinSight Agents Coordinating...</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">{activeStepText}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="pt-2 flex flex-wrap items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Suggested:
        </span>
        {suggestedQueries[language]?.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-medium border border-slate-200 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-card shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder={`Ask FinSight AI about ${company.name} in ${SUPPORTED_LANGUAGES[language].name}...`}
          className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 px-3 py-2 bg-transparent focus:outline-none"
          disabled={isLoading}
        />
        <Button
          variant="ai"
          size="sm"
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          icon={<Send className="w-3.5 h-3.5" />}
        >
          Interrogate
        </Button>
      </div>
    </div>
  );
}
