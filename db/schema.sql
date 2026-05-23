-- ===========================================================================
-- CBR Labs — admin database schema (Cloudflare D1 / SQLite)
-- Apply with:
--   wrangler d1 execute cbr-labs-db --remote --file=./db/schema.sql
-- For local dev:
--   wrangler d1 execute cbr-labs-db --local  --file=./db/schema.sql
-- ===========================================================================

-- ---------- Customers & purchase orders -----------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  org             TEXT,
  email           TEXT,
  phone           TEXT,
  billing_address TEXT,
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  po_number           TEXT NOT NULL UNIQUE,
  customer_id         INTEGER NOT NULL REFERENCES customers(id),
  status              TEXT NOT NULL DEFAULT 'OPEN'
                      CHECK(status IN ('OPEN','IN_PROGRESS','READY_TO_INVOICE','INVOICED','PAID','CANCELLED')),
  scope_notes         TEXT,
  quoted_amount_cents INTEGER,
  due_date            TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_po_customer ON purchase_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_po_status   ON purchase_orders(status);

-- ---------- Devices (chain of custody) ------------------------------------
CREATE TABLE IF NOT EXISTS devices (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tag           TEXT NOT NULL UNIQUE,           -- e.g. CBR-2026-0142
  box_tag       TEXT,                            -- intake box ID (chain-of-custody unit)
  po_id         INTEGER REFERENCES purchase_orders(id),
  customer_id   INTEGER REFERENCES customers(id),
  platform      TEXT,                            -- 'iPad' | 'Android'
  model         TEXT,
  serial_number TEXT,
  imei          TEXT,
  redactions    TEXT,                            -- JSON: ['CAMERA','MIC','SPEAKER','WIFI','BT','ANTENNA']
  state         TEXT NOT NULL DEFAULT 'RECEIVED'
                CHECK(state IN ('RECEIVED','INTAKE','IN_QUEUE','ON_BENCH','REDACTED',
                                'VERIFIED','CERT_ISSUED','PACKED','SHIPPED','DELIVERED',
                                'HOLD','RETURNED')),
  technician    TEXT,
  cert_number   TEXT UNIQUE,
  shipped_at    TEXT,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_devices_state    ON devices(state);
CREATE INDEX IF NOT EXISTS idx_devices_po       ON devices(po_id);
CREATE INDEX IF NOT EXISTS idx_devices_box      ON devices(box_tag);
CREATE INDEX IF NOT EXISTS idx_devices_customer ON devices(customer_id);

-- Every state transition is logged. This table *is* the chain of custody.
CREATE TABLE IF NOT EXISTS device_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id   INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,                    -- 'STATE_CHANGE' | 'PHOTO' | 'NOTE' | 'CERT' | 'SHIPPED'
  from_state  TEXT,
  to_state    TEXT,
  actor       TEXT NOT NULL,                    -- Cloudflare Access email of the technician
  payload     TEXT,                              -- JSON details
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_device ON device_events(device_id);
CREATE INDEX IF NOT EXISTS idx_events_when   ON device_events(occurred_at);

CREATE TABLE IF NOT EXISTS device_photos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id   INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  phase       TEXT NOT NULL CHECK(phase IN ('INTAKE','BEFORE','AFTER','SHIPPING')),
  r2_key      TEXT NOT NULL,
  caption     TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_photos_device ON device_photos(device_id);

-- ---------- Invoices, payments, expenses ----------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id    INTEGER NOT NULL REFERENCES customers(id),
  po_id          INTEGER REFERENCES purchase_orders(id),
  status         TEXT NOT NULL DEFAULT 'DRAFT'
                 CHECK(status IN ('DRAFT','SENT','PARTIAL','PAID','VOID')),
  issue_date     TEXT NOT NULL DEFAULT (date('now')),
  due_date       TEXT,
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents      INTEGER NOT NULL DEFAULT 0,
  total_cents    INTEGER NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_inv_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_inv_status   ON invoices(status);

CREATE TABLE IF NOT EXISTS invoice_lines (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id       INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description      TEXT NOT NULL,
  quantity         INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  amount_cents     INTEGER NOT NULL,
  device_id        INTEGER REFERENCES devices(id)
);
CREATE INDEX IF NOT EXISTS idx_lines_invoice ON invoice_lines(invoice_id);

CREATE TABLE IF NOT EXISTS cash_receipts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id   INTEGER REFERENCES invoices(id),
  customer_id  INTEGER REFERENCES customers(id),
  received_at  TEXT NOT NULL DEFAULT (date('now')),
  amount_cents INTEGER NOT NULL,
  method       TEXT NOT NULL CHECK(method IN ('CHECK','WIRE','ACH','CARD','CASH','OTHER')),
  reference    TEXT,                            -- check #, wire ref, last-4
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_receipts_invoice  ON cash_receipts(invoice_id);
CREATE INDEX IF NOT EXISTS idx_receipts_customer ON cash_receipts(customer_id);

CREATE TABLE IF NOT EXISTS expense_categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS expense_receipts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  paid_at      TEXT NOT NULL DEFAULT (date('now')),
  vendor       TEXT NOT NULL,
  category_id  INTEGER REFERENCES expense_categories(id),
  amount_cents INTEGER NOT NULL,
  method       TEXT NOT NULL CHECK(method IN ('CHECK','WIRE','ACH','CARD','CASH','OTHER')),
  reference    TEXT,
  r2_key       TEXT,                            -- uploaded receipt scan
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_expenses_paid     ON expense_receipts(paid_at);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expense_receipts(category_id);

-- ---------- Documents vault (COI, CAGE, NDAs, etc.) -----------------------
CREATE TABLE IF NOT EXISTS documents (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  kind        TEXT NOT NULL,                    -- 'COI','CAGE','NDA','SOP','OTHER'
  name        TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  expires_at  TEXT,
  notes       TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Counters for human-readable sequential numbering --------------
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

-- Seed counters + expense categories (idempotent).
INSERT OR IGNORE INTO counters (name, value) VALUES
  ('device_tag',     0),
  ('cert_number',    0),
  ('invoice_number', 0),
  ('po_number',      0),
  ('box_tag',        0);

INSERT OR IGNORE INTO expense_categories (name) VALUES
  ('Materials & Parts'),
  ('Equipment'),
  ('Shipping'),
  ('Software & SaaS'),
  ('Insurance'),
  ('Legal & Professional'),
  ('Travel'),
  ('Office'),
  ('Other');
