import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight AI — Agentic Multilingual Financial Intelligence Platform",
  description:
    "Institutional AI platform analyzing corporate financial performance, macroeconomic indicators, geopolitical risk, and deterministic forecasts through multilingual reasoning.",
  keywords: [
    "Financial Intelligence",
    "Agentic AI",
    "Multilingual Finance",
    "Forecasting",
    "Scenario Simulator",
    "Altman Z-Score",
    "Explainable AI",
    "pgvector",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
