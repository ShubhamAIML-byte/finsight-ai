-- =============================================================================
-- FinSight AI — PostgreSQL Schema with pgvector and Row-Level Security (RLS)
-- =============================================================================

-- Enable pgvector extension for dense financial document embeddings
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker VARCHAR(12) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    industry VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    market_cap NUMERIC(12, 2) NOT NULL, -- USD Billions
    description TEXT,
    pe_ratio NUMERIC(8, 2),
    dividend_yield NUMERIC(6, 2),
    beta NUMERIC(6, 2),
    health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
    piotroski_f_score INTEGER CHECK (piotroski_f_score BETWEEN 0 AND 9),
    altman_z_score NUMERIC(8, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FINANCIAL METRICS & STATEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    ticker VARCHAR(12) NOT NULL,
    year INTEGER NOT NULL,
    revenue NUMERIC(12, 2) NOT NULL,
    cogs NUMERIC(12, 2) NOT NULL,
    gross_profit NUMERIC(12, 2) NOT NULL,
    operating_expenses NUMERIC(12, 2) NOT NULL,
    ebitda NUMERIC(12, 2) NOT NULL,
    ebit NUMERIC(12, 2) NOT NULL,
    interest_expense NUMERIC(12, 2) NOT NULL,
    tax_expense NUMERIC(12, 2) NOT NULL,
    net_income NUMERIC(12, 2) NOT NULL,
    operating_cash_flow NUMERIC(12, 2) NOT NULL,
    capital_expenditures NUMERIC(12, 2) NOT NULL,
    free_cash_flow NUMERIC(12, 2) NOT NULL,
    total_assets NUMERIC(12, 2) NOT NULL,
    current_assets NUMERIC(12, 2) NOT NULL,
    cash_and_equivalents NUMERIC(12, 2) NOT NULL,
    total_liabilities NUMERIC(12, 2) NOT NULL,
    current_liabilities NUMERIC(12, 2) NOT NULL,
    total_debt NUMERIC(12, 2) NOT NULL,
    stockholders_equity NUMERIC(12, 2) NOT NULL,
    shares_outstanding NUMERIC(10, 2) NOT NULL,
    eps NUMERIC(8, 2) NOT NULL,
    gross_margin NUMERIC(6, 2),
    operating_margin NUMERIC(6, 2),
    net_margin NUMERIC(6, 2),
    roe NUMERIC(6, 2),
    roa NUMERIC(6, 2),
    debt_to_equity NUMERIC(6, 2),
    current_ratio NUMERIC(6, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, year)
);

-- 3. MARKET AND GEOPOLITICAL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.market_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    publication_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    related_companies TEXT[] DEFAULT '{}',
    related_industries TEXT[] DEFAULT '{}',
    affected_regions TEXT[] DEFAULT '{}',
    potential_impact TEXT,
    impact_direction VARCHAR(20) CHECK (impact_direction IN ('positive', 'negative', 'mixed', 'neutral')),
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
    confidence_level NUMERIC(4, 2) CHECK (confidence_level BETWEEN 0 AND 1),
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UPLOADED DOCUMENTS & FILINGS
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    company_ticker VARCHAR(12),
    reporting_period VARCHAR(50),
    publication_date DATE,
    status VARCHAR(30) DEFAULT 'indexed',
    chunk_count INTEGER DEFAULT 0,
    verified_source BOOLEAN DEFAULT true,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCUMENT CHUNKS WITH PGVECTOR (1536-dimensional embeddings for OpenAI text-embedding-3-small)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER NOT NULL,
    page_number INTEGER,
    section_heading VARCHAR(255),
    reporting_period VARCHAR(50),
    company_ticker VARCHAR(12),
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for fast vector cosine similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
ON public.document_chunks
USING hnsw (embedding vector_cosine_ops);

-- 6. FORECAST RUNS TABLE
CREATE TABLE IF NOT EXISTS public.forecast_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    company_ticker VARCHAR(12) NOT NULL,
    metric VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    horizon VARCHAR(30) NOT NULL,
    mae NUMERIC(8, 2),
    rmse NUMERIC(8, 2),
    mape NUMERIC(6, 2),
    forecast_points JSONB NOT NULL,
    assumptions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SCENARIO SIMULATION RUNS TABLE
CREATE TABLE IF NOT EXISTS public.scenario_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    company_ticker VARCHAR(12) NOT NULL,
    preset_name VARCHAR(100),
    currency_movement NUMERIC(6, 2) NOT NULL,
    tariff_increase NUMERIC(6, 2) NOT NULL,
    interest_rate_change NUMERIC(6, 2) NOT NULL,
    supply_chain_cost_increase NUMERIC(6, 2) NOT NULL,
    revenue_decline NUMERIC(6, 2) NOT NULL,
    market_downturn NUMERIC(6, 2) NOT NULL,
    impact_metrics JSONB NOT NULL,
    stress_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STRATEGIC RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_ticker VARCHAR(12) NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    business_objective TEXT NOT NULL,
    explanation TEXT NOT NULL,
    supporting_metrics JSONB NOT NULL,
    related_events TEXT[] DEFAULT '{}',
    expected_impact JSONB NOT NULL,
    confidence_score NUMERIC(4, 2) NOT NULL,
    potential_risks TEXT[] DEFAULT '{}',
    implementation_steps JSONB NOT NULL,
    source_references JSONB NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CHAT SESSIONS AND MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    company_ticker VARCHAR(12) DEFAULT 'AAPL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    detected_language VARCHAR(10),
    company_context VARCHAR(12),
    citations JSONB,
    agent_steps JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT EVENTS LOG TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for global benchmark companies & macro events
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read financial_metrics" ON public.financial_metrics FOR SELECT USING (true);
CREATE POLICY "Public read market_events" ON public.market_events FOR SELECT USING (true);
CREATE POLICY "Public read recommendations" ON public.recommendations FOR SELECT USING (true);

-- User-scoped policies for chat, documents, and runs
CREATE POLICY "User documents access" ON public.documents
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "User chunks access" ON public.document_chunks
    FOR SELECT USING (true);

CREATE POLICY "User chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "User chat messages" ON public.chat_messages
    FOR ALL USING (true);

CREATE POLICY "User forecast runs" ON public.forecast_runs
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "User scenario runs" ON public.scenario_runs
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
