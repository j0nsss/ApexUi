-- ApexUI — Initial Schema Migration
-- Creates all 4 tables, indexes, RLS policies, and analytics views.
-- Safe to re-run (uses DROP IF EXISTS for idempotency).

-- ============================================================
-- Clean up previous run (safe for re-execution)
-- CASCADE drops dependent objects (policies, triggers, indexes).
-- ============================================================

DROP VIEW IF EXISTS vw_daily_copy_events;
DROP VIEW IF EXISTS vw_top_components;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS code_variants CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP FUNCTION IF EXISTS update_components_search_vector();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================================
-- Helper: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Table: components
-- ============================================================

CREATE TABLE components (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  bento_size    TEXT NOT NULL DEFAULT '1x1',
  copy_count    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER DEFAULT 100,
  customizer_schema  JSONB,
  random_data_schema JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  search_vector TSVECTOR
);

CREATE INDEX idx_components_category ON components (category);
CREATE INDEX idx_components_slug ON components (slug);
CREATE INDEX idx_components_search ON components USING GIN (search_vector);
CREATE INDEX idx_components_published ON components (is_published, sort_order);

CREATE OR REPLACE FUNCTION update_components_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.name, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.category, '') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_components_search_vector
  BEFORE INSERT OR UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_components_search_vector();

CREATE TRIGGER trg_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Table: code_variants
-- ============================================================

CREATE TABLE code_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id    UUID NOT NULL REFERENCES components (id) ON DELETE CASCADE,
  language        TEXT NOT NULL,
  code_template   TEXT NOT NULL,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_component_language UNIQUE (component_id, language)
);

CREATE INDEX idx_code_variants_component ON code_variants (component_id);

CREATE TRIGGER trg_code_variants_updated_at
  BEFORE UPDATE ON code_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Table: analytics_events
-- ============================================================

CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      TEXT NOT NULL,
  component_id    UUID REFERENCES components (id) ON DELETE SET NULL,
  component_slug  TEXT,
  language        TEXT,
  route           TEXT,
  search_query    TEXT,
  session_id      TEXT,
  ip_hash         TEXT,
  user_agent_hash TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_event_type ON analytics_events (event_type, created_at DESC);
CREATE INDEX idx_analytics_component ON analytics_events (component_id, event_type, created_at DESC);
CREATE INDEX idx_analytics_created ON analytics_events (created_at DESC);

-- ============================================================
-- Table: admin_users
-- ============================================================

CREATE TABLE admin_users (
  id              UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- components: public read (published only), admin write
CREATE POLICY "Public can read published components"
  ON components FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can do all on components"
  ON components FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- code_variants: public read, admin write
CREATE POLICY "Public can read code variants"
  ON code_variants FOR SELECT
  USING (true);

CREATE POLICY "Admins can do all on code_variants"
  ON code_variants FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- analytics_events: admin-only read, insert via service-role Edge Function only
CREATE POLICY "Admins can read analytics"
  ON analytics_events FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- admin_users: no public access
CREATE POLICY "Admins only"
  ON admin_users FOR ALL
  USING (auth.uid() = id);

-- ============================================================
-- Analytics Views
-- ============================================================

CREATE VIEW vw_daily_copy_events AS
SELECT
  DATE_TRUNC('day', created_at) AS event_date,
  COUNT(*) AS copy_count
FROM analytics_events
WHERE event_type = 'copy'
GROUP BY 1
ORDER BY 1;

CREATE VIEW vw_top_components AS
SELECT
  component_slug,
  COUNT(*) AS copy_count,
  language
FROM analytics_events
WHERE event_type = 'copy'
  AND created_at >= now() - INTERVAL '30 days'
GROUP BY component_slug, language
ORDER BY copy_count DESC
LIMIT 10;
