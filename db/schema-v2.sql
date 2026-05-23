-- ===========================================================================
-- CBR Labs — admin database schema v2 (Cloudflare D1 / SQLite)
--
-- Run AFTER schema.sql. Adds: leads, proposals, proposal_lines, share_tokens.
-- Idempotent — safe to re-run.
-- ===========================================================================

-- ---------- Leads (public contact form submissions) -----------------------
CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  org           TEXT,
  use_case      TEXT,
  device_count  TEXT,           -- "1-10","10-100","100+","unsure"
  timeline      TEXT,           -- "asap","30d","60d","90d+","exploring"
  message       TEXT,
  source        TEXT,           -- e.g. 'contact-form','neutered-ipad','sam.gov'
  status        TEXT NOT NULL DEFAULT 'NEW'
                CHECK(status IN ('NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','WON','LOST','SPAM')),
  ip            TEXT,
  user_agent    TEXT,
  customer_id   INTEGER REFERENCES customers(id), -- promoted on WON
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- ---------- Proposals -----------------------------------------------------
CREATE TABLE IF NOT EXISTS proposals (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_number TEXT NOT NULL UNIQUE,
  customer_id     INTEGER REFERENCES customers(id),
  lead_id         INTEGER REFERENCES leads(id),
  title           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'DRAFT'
                  CHECK(status IN ('DRAFT','SENT','VIEWED','ACCEPTED','REJECTED','EXPIRED','WITHDRAWN')),
  scope_summary   TEXT,
  terms           TEXT,                          -- payment terms, validity, etc.
  valid_until     TEXT,
  subtotal_cents  INTEGER NOT NULL DEFAULT 0,
  tax_cents       INTEGER NOT NULL DEFAULT 0,
  total_cents     INTEGER NOT NULL DEFAULT 0,
  sent_at         TEXT,
  viewed_at       TEXT,
  responded_at    TEXT,
  response_note   TEXT,
  po_id           INTEGER REFERENCES purchase_orders(id), -- set when accepted → PO
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_proposals_customer ON proposals(customer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status   ON proposals(status);

CREATE TABLE IF NOT EXISTS proposal_lines (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id      INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  position         INTEGER NOT NULL DEFAULT 0,
  description      TEXT NOT NULL,
  quantity         INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  amount_cents     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_prop_lines_proposal ON proposal_lines(proposal_id);

-- ---------- Share tokens (public, unguessable URLs for proposals/invoices)
-- Used to share docs externally without forcing Cloudflare Access login.
CREATE TABLE IF NOT EXISTS share_tokens (
  token        TEXT PRIMARY KEY,                -- 32-char random
  kind         TEXT NOT NULL CHECK(kind IN ('PROPOSAL','INVOICE','DOCUMENT','CERT')),
  target_id    INTEGER NOT NULL,                -- id of the row in the relevant table
  created_by   TEXT NOT NULL,                   -- access email of who created it
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at   TEXT,                             -- optional expiry
  revoked_at   TEXT,
  last_used_at TEXT,
  use_count    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_share_target ON share_tokens(kind, target_id);

-- ---------- Counters for proposals + leads --------------------------------
INSERT OR IGNORE INTO counters (name, value) VALUES
  ('proposal_number', 0),
  ('lead_number',     0);

-- ---------- Convenience: status timestamp on documents --------------------
-- Add expiry tracking columns if upgrading an existing documents table.
-- (Safe to ignore "duplicate column" errors when running on a fresh schema.)
-- These are commented out because D1 doesn't support IF NOT EXISTS on ALTER.
-- Run manually if upgrading: ALTER TABLE documents ADD COLUMN customer_id INTEGER;
