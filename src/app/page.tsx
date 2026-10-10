"use client";

import React, { useState } from "react";
import { COMPANIES } from "@/data/companies";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { MACRO_INDICATORS, GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";
import { RECOMMENDATIONS } from "@/data/recommendations";
import { SupportedLanguage } from "@/types/chat";
import { Company } from "@/types/financial";
import { NavSection, Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { NotificationsDrawer } from "@/components/layout/NotificationsDrawer";
import { ReportExportModal } from "@/components/export/ReportExportModal";

// Views
import { KpiCardsGrid } from "@/components/dashboard/KpiCardsGrid";
import { RevenueProfitChart } from "@/components/dashboard/RevenueProfitChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { RiskRadarChart } from "@/components/dashboard/RiskRadarChart";
import { ExecutiveSummaryCard } from "@/components/dashboard/ExecutiveSummaryCard";
import { FinancialHealthScoreCard } from "@/components/dashboard/FinancialHealthScoreCard";
import { TopRecommendationsCard } from "@/components/dashboard/TopRecommendationsCard";
import { RecentIntelligenceFeed } from "@/components/dashboard/RecentIntelligenceFeed";
import { CompanyIntelligenceView } from "@/components/company/CompanyIntelligenceView";
import { FinancialStatementsView } from "@/components/financials/FinancialStatementsView";
import { MarketIntelligenceView } from "@/components/market/MarketIntelligenceView";
import { GeopoliticalRiskView } from "@/components/geopolitical/GeopoliticalRiskView";
import { ForecastingLabView } from "@/components/forecasting/ForecastingLabView";
import { ScenarioSimulatorView } from "@/components/scenario/ScenarioSimulatorView";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import { ExplainableAiView } from "@/components/explainability/ExplainableAiView";
import { MultilingualChatView } from "@/components/chat/MultilingualChatView";
import { DocumentLibraryView } from "@/components/documents/DocumentLibraryView";
import { SettingsView } from "@/components/settings/SettingsView";

export default function FinSightDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0]);
  const [currentSection, setCurrentSection] = useState<NavSection>("overview");
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Derive active company financial history
  const history =
    FINANCIAL_METRICS_BY_TICKER[selectedCompany.ticker] || FINANCIAL_METRICS_BY_TICKER["AAPL"];
  const latestFinancials = history[history.length - 1];
  const priorFinancials = history.length > 1 ? history[history.length - 2] : undefined;

  const companyRecommendations = RECOMMENDATIONS.filter(
    (r) => r.companyTicker === selectedCompany.ticker
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavbar
          companies={COMPANIES}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
          currentLanguage={currentLanguage}
          onChangeLanguage={setCurrentLanguage}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenExportReport={() => setIsExportModalOpen(true)}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Section 1: Overview (Executive Dashboard) */}
            {currentSection === "overview" && (
              <div className="space-y-6">
                {/* Executive Summary AI Brief */}
                <ExecutiveSummaryCard
                  company={selectedCompany}
                  latest={latestFinancials}
                  onNavigateToChat={() => setCurrentSection("chat")}
                />

                {/* KPI Cards Grid */}
                <KpiCardsGrid current={latestFinancials} prior={priorFinancials} />

                {/* Primary Chart Trajectories (2 columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueProfitChart history={history} companyName={selectedCompany.name} />
                  <CashFlowChart history={history} />
                </div>

                {/* Health Matrix & Risk Distribution (2 columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <FinancialHealthScoreCard
                      company={selectedCompany}
                      current={latestFinancials}
                      prior={priorFinancials}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <RiskRadarChart companyTicker={selectedCompany.ticker} />
                  </div>
                </div>

                {/* Strategic Directives & Recent Intelligence (2 columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TopRecommendationsCard
                    recommendations={companyRecommendations}
                    onNavigateToRecommendations={() => setCurrentSection("recommendations")}
                  />
                  <RecentIntelligenceFeed
                    events={GEOPOLITICAL_EVENTS}
                    indicators={MACRO_INDICATORS}
                    onNavigateToMarket={() => setCurrentSection("market")}
                  />
                </div>
              </div>
            )}

            {/* Section 2: Company Intelligence */}
            {currentSection === "company" && (
              <CompanyIntelligenceView
                company={selectedCompany}
                history={history}
                onSelectCompany={setSelectedCompany}
                onNavigateToStatements={() => setCurrentSection("statements")}
              />
            )}

            {/* Section 3: Financial Statements */}
            {currentSection === "statements" && (
              <FinancialStatementsView
                company={selectedCompany}
                history={history}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
            )}

            {/* Section 4: Market Intelligence */}
            {currentSection === "market" && (
              <MarketIntelligenceView
                indicators={MACRO_INDICATORS}
                events={GEOPOLITICAL_EVENTS}
              />
            )}

            {/* Section 5: Geopolitical Risk */}
            {currentSection === "geopolitical" && (
              <GeopoliticalRiskView
                company={selectedCompany}
                events={GEOPOLITICAL_EVENTS}
                onNavigateToScenarios={() => setCurrentSection("scenarios")}
              />
            )}

            {/* Section 6: Forecasting Lab */}
            {currentSection === "forecasting" && (
              <ForecastingLabView company={selectedCompany} history={history} />
            )}

            {/* Section 7: Scenario Simulator */}
            {currentSection === "scenarios" && (
              <ScenarioSimulatorView
                company={selectedCompany}
                latestFinancials={latestFinancials}
              />
            )}

            {/* Section 8: AI Recommendations */}
            {currentSection === "recommendations" && (
              <RecommendationsView
                company={selectedCompany}
                recommendations={RECOMMENDATIONS}
                onOpenExportReport={() => setIsExportModalOpen(true)}
              />
            )}

            {/* Section 9: Explainable AI */}
            {currentSection === "explainability" && (
              <ExplainableAiView
                company={selectedCompany}
                latest={latestFinancials}
                prior={priorFinancials}
              />
            )}

            {/* Section 10: Multilingual AI Chat */}
            {currentSection === "chat" && (
              <MultilingualChatView
                company={selectedCompany}
                language={currentLanguage}
                onChangeLanguage={setCurrentLanguage}
                onSelectCompany={setSelectedCompany}
              />
            )}

            {/* Section 11: Document Library */}
            {currentSection === "documents" && (
              <DocumentLibraryView
                company={selectedCompany}
                isOpenUploadModal={isUploadModalOpen}
                onCloseUploadModal={() => setIsUploadModalOpen(false)}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
              />
            )}

            {/* Section 12: Settings */}
            {currentSection === "settings" && (
              <SettingsView
                currentLanguage={currentLanguage}
                onChangeLanguage={setCurrentLanguage}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCompany={setSelectedCompany}
        onNavigateSection={setCurrentSection}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToRisk={() => setCurrentSection("geopolitical")}
      />

      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        company={selectedCompany}
        latest={latestFinancials}
        history={history}
        recommendations={companyRecommendations}
        events={GEOPOLITICAL_EVENTS}
      />
    </div>
  );
}
