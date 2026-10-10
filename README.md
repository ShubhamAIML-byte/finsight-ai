# FinSight AI — Agentic Multilingual Financial Intelligence & Recommendation Platform

FinSight AI is an institutional-grade, full-stack financial intelligence platform designed for investment analysts, CFOs, asset managers, and board advisory teams. It autonomously analyzes corporate performance, monitors macroeconomic indicators and geopolitical trade policies, forecasts multi-year financial statements via out-of-sample walk-forward validation, performs real-time scenario stress-testing, and delivers explainable strategic recommendations through a multilingual conversational reasoning interface.

---

## 1. System Architecture & Tech Stack

```
                                    +-------------------------------------------------------------+
                                    |                 FinSight AI Platform UI                     |
                                    | Next.js App Router | Tailwind CSS | shadcn/ui | Recharts    |
                                    +-------------------------------------------------------------+
                                                                   |
                                    +------------------------------v------------------------------+
                                    |                 Multi-Agent Orchestrator                    |
                                    |               (TypeScript Agent Pipeline)                   |
                                    +-------------------------------------------------------------+
                                         |          |          |          |          |          |
    +------------------------------------+          |          |          |          |          +------------------------------------+
    |                         |                     |          |          |          |                     |                         |
+---v----------------+   +----v---------------+   +-v----------v---+   +--v----------v---+   +---------v----------+   +----------v---------+
| Financial Analysis |   | Economic Intel     |   | Geopolitical   |   | Industry Intel  |   | Forecasting Agent  |   | Explainability     |
| Agent              |   | Agent              |   | Risk Agent     |   | Agent           |   | (Ensemble/Holt/AR) |   | (SHAP Attribution) |
+--------------------+   +--------------------+   +----------------+   +-----------------+   +--------------------+   +--------------------+
                                         |          |          |          |          |          |
                                    +----v----------v----------v----------v----------v----------v-+
                                    |               Strategic Recommendation Agent                |
                                    +-------------------------------------------------------------+
                                                                   |
                                    +------------------------------v------------------------------+
                                    |                 Serverless API Handlers                     |
                                    |         /api/chat | /api/forecasting | /api/scenarios       |
                                    +-------------------------------------------------------------+
                                            /                                              \
               +---------------------------v---+                                +-----------v-------------------+
               |      OpenAI Reasoning Enclave |                                |    Supabase / PostgreSQL      |
               | (Server-Side Only / Sandbox)  |                                | pgvector (HNSW) | RLS Policies|
               +-------------------------------+                                +-------------------------------+
```

### Technology Highlights:
- **Framework:** Next.js (App Router, Server-side API handlers, TypeScript Strict Mode).
- **Styling & Components:** Tailwind CSS, customized Institutional Navy & Emerald palettes, Lucide icons.
- **Visual Analytics:** Interactive Recharts composed charts, bar graphs, prediction interval envelopes, radar charts.
- **Database & Vectors:** Supabase PostgreSQL with `pgvector` extension for 1536-dimensional HNSW vector cosine search and Row-Level Security (RLS).
- **AI & Agents:** Modular TypeScript Agent pipeline + OpenAI serverless integration with built-in zero-hallucination deterministic calculation guarantees.
- **Testing:** Vitest unit test suite covering financial mathematics, forecasting metrics, scenarios, and agent orchestration.
- **Deployment:** Vercel serverless-ready architecture.

---

## 2. Key Capabilities & Modules

### 1. Executive Dashboard (Overview)
- **KPI Metrics Cards:** Consolidated Revenue, EBITDA, Net Profit, Operating Margin, Free Cash Flow, and Debt-to-Equity with prior-period comparisons, percentage deltas, and tooltips.
- **Multi-Trajectory Visualizations:** Composed revenue/profit charts and cash flow conversion graphs with CapEx analysis.
- **Financial Health Matrix:** Automated Piotroski F-Score (0–9 scale) and Altman Z-Score calculation to identify insolvency risk.
- **Multi-Vector Risk Radar:** Real-time vulnerability assessment across tariffs, currency movements, and supply chain friction.

### 2. Company Financial Data Management
- Multi-company coverage across diverse sectors (e.g., Apple `AAPL`, NVIDIA `NVDA`, Tesla `TSLA`, Novo Nordisk `NVO`, Tata Consultancy Services `TCS`).
- 5+ years of verified historical statements (FY2021 – FY2025).
- Structured financial statement tabs: Income Statement, Balance Sheet, Cash Flow, and Financial Ratios with CSV export and filing upload support.

### 3. Market & Geopolitical Intelligence
- Macroeconomic rate tickers: US 10Y Yield, Federal Funds Target Rate, US Dollar Index (DXY), EUR/USD, USD/INR, Brent Crude, CPI Inflation, and PHLX Semiconductor Index.
- Verified geopolitical events monitoring US BIS export regulations, EU Carbon Border Adjustment Mechanism (CBAM), and maritime transit insurance surcharges.

### 4. Forecasting Laboratory
- **Models:** OLS Linear Trend Decomposition, Holt's Double Exponential Smoothing, Autoregressive AR(1), and Multi-Model Weighted Ensemble.
- **Horizons:** Quarterly, 1-Year Forward, 3-Year Horizon, and 5-Year Horizon.
- **Statistical Envelopes:** 80% and 95% confidence intervals derived from empirical residual distributions.
- **Validation:** Strict out-of-sample chronological walk-forward validation (calculating MAE, RMSE, and MAPE without lookahead bias).

### 5. Scenario Stress Simulator
- Interactive parameter sliders: Currency Movement (-20% to +20%), Tariff Escalation (0% to 35%), Interest Rate Shifts (-300 to +500 bps), Supply Chain Inflation (0% to 40%), Revenue Contraction (-30% to +10%).
- Pre-configured stress tests: *Global Trade War Escalation*, *Stagflationary Shock*, *Emerging Market FX Crash*, and *Severe Global Recession*.
- Instant deterministic financial impact calculation on Revenue, COGS, EBITDA, Net Income, Operating Margins, and FCF.

### 6. AI Recommendation Center
- Board-level strategic recommendations categorized by Cost Optimization, Risk Mitigation, Pricing Strategies, Market Expansion, and Capital Allocation.
- Prioritized cards with confidence scores, impact ranges in USD and percentage points, potential execution risks, and multi-phase implementation roadmaps.

### 7. Explainable AI & Feature Attribution
- Transparent feature contribution analysis using additive Shapley attribution methodology to explain operating margin shifts.
- Traceable evidence chain linking every quantitative conclusion back to audited SEC Form 10-K/10-Q disclosures and regulatory bulletins.

### 8. Multilingual Conversational AI
- Support for **English**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**, **Spanish (Español)**, and **French (Français)**.
- Autonomous agent trace inspector rendering intermediate reasoning stages in real-time.
- Source citations with similarity matching percentages and verifiable excerpts.

---

## 3. Database Schema & Setup (Supabase / PostgreSQL)

The database schema is located at:
`supabase/migrations/20260101000000_finsight_schema.sql`

### Tables Included:
1. `companies` — Corporate master entities and health benchmarks.
2. `financial_metrics` — Multi-year balance sheets, income statements, cash flows, and ratios.
3. `market_events` — Macroeconomic indicators and geopolitical policy bulletins.
4. `documents` — Metadata for uploaded Form 10-K, 10-Q, and investor presentations.
5. `document_chunks` — Text segments with 1536-dim vector embeddings and HNSW indexes.
6. `forecast_runs` — Persisted forecasting runs with evaluation metrics.
7. `scenario_runs` — User-simulated stress tests and vulnerability scores.
8. `recommendations` — Prioritized strategic directives and approval statuses.
9. `chat_sessions` & `chat_messages` — Multilingual conversation logs and citations.
10. `audit_logs` — Institutional audit events.

### To Apply Migrations in Supabase:
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Navigate to **SQL Editor**.
3. Copy the contents of `supabase/migrations/20260101000000_finsight_schema.sql` and run the script.
4. Copy your **Project URL** and **anon/public API key** into your environment variables.

> **Note on Demo Mode:** When Supabase credentials are not provided, FinSight AI automatically activates its robust in-memory mock repository, allowing the full dashboard, calculations, and simulations to function smoothly out of the box.

---

## 4. Local Development Setup

### Prerequisites:
- Node.js 18.x or 20.x+
- npm or pnpm

### Steps:
```bash
# 1. Clone the repository
git clone https://github.com/your-username/finsight-ai.git
cd finsight-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run the development server
npm run dev

# 5. Open in browser
# Visit http://localhost:3000
```

---

## 5. Running Tests

FinSight AI includes a comprehensive Vitest test suite verifying all deterministic calculations:

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch
```

Tests verify:
- Deterministic Gross Margin, Operating Margin, EBITDA, ROE, ROA, Debt/Equity.
- Altman Z-Score & Piotroski F-Score solvency classifications.
- Chronological walk-forward validation (MAE, RMSE, MAPE) without data leakage.
- Parametric scenario stress-test sensitivity calculations.
- Multi-Agent Orchestrator pipeline execution and multilingual synthesis.

---

## 6. Vercel Deployment Guide

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit of FinSight AI platform"
git branch -M main
git remote add origin https://github.com/your-username/finsight-ai.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository `finsight-ai`.
4. Framework Preset: **Next.js**.
5. Build Command: `npm run build`.
6. Output Directory: `.next`.

### Step 3: Configure Environment Variables in Vercel
Under the **Environment Variables** section, configure the following:

| Variable Name | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | Optional | Set to `production` |
| `NEXT_PUBLIC_ENABLE_DEMO_DATA` | Optional | Set to `true` |
| `OPENAI_API_KEY` | Optional | OpenAI API Key (enables live gpt-4o-mini completions) |
| `OPENAI_MODEL` | Optional | Model identifier (defaults to `gpt-4o-mini`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Your Supabase Anon Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side Supabase Service Role Key |

### Step 4: Deploy & Verify
Click **Deploy**. Once the build succeeds, your application is live with globally distributed edge endpoints.

---

## 7. Security & Compliance
- **Zero API Key Leaks:** All AI LLM requests and private keys are encapsulated in serverless API routes (`/api/*`). Client bundles contain zero secrets.
- **Deterministic Math:** Financial ratios, scenario outputs, and forecasting metrics are computed deterministically in code; the LLM is only utilized for strategic synthesis and linguistic translation.
- **Row-Level Security:** Supabase tables enforce user-scoped RLS policies ensuring isolated tenant data access.
