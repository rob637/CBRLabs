"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "./_components/api";
import StateChip from "./_components/StateChip";

const tiles = [
  { href: "/admin/intake",     label: "New intake",      sub: "Receive devices, mint tags" },
  { href: "/admin/scan",       label: "Scan QR",         sub: "Open a record from a sticker" },
  { href: "/admin/devices",    label: "Devices",         sub: "Queue, bench, and beyond" },
  { href: "/admin/labels",     label: "Sticker sheets",  sub: "Generate Avery PDFs" },
  { href: "/admin/customers",  label: "Customers",       sub: "Accounts and contacts" },
  { href: "/admin/pos",        label: "Purchase orders", sub: "Work scoped to a PO" },
  { href: "/admin/invoices",   label: "Invoices",        sub: "Bill customers, track A/R" },
  { href: "/admin/receipts",   label: "Cash receipts",   sub: "Record payments" },
  { href: "/admin/proposals",  label: "Proposals",       sub: "Branded scopes, online accept" },
  { href: "/admin/leads",      label: "Leads",           sub: "Inbound from /contact" },
  { href: "/admin/documents",  label: "Documents",       sub: "COI, NDA, contracts" },
];

const KPI_ORDER = [
  ["devices_open",      "On bench / open"],
  ["intake_this_month", "Intake this month"],
  ["certs_issued",      "Certs issued (all-time)"],
  ["pos_open",          "Open POs"],
  ["customers",         "Customers"],
  ["devices_total",     "Devices (all-time)"],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.get("/api/stats").then(setStats).catch((e) => setErr(e.message));
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
  }, []);

  const totals = stats?.totals || {};

  return (
    <div className="space-y-10">
      <header>
        <div className="eyebrow">Admin</div>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tightest sm:text-5xl">
          Operations dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Inventory, chain of custody, invoicing, and receipts — all in one place,
          all backed by Cloudflare D1 and R2.
        </p>
      </header>

      <section className="grid gap-px bg-ink/[0.08] border hairline sm:grid-cols-2 lg:grid-cols-3">
        {KPI_ORDER.map(([key, label]) => (
          <div key={key} className="bg-paper p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
            <div className="mt-2 font-display text-3xl font-medium tracking-tight">
              {stats ? (totals[key] ?? 0) : "—"}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-px bg-ink/[0.08] border hairline sm:grid-cols-2 lg:grid-cols-4">
        <Money label="A/R outstanding"     cents={totals.ar_total_cents} href="/admin/invoices" accent />
        <Money label="Revenue this month"  cents={totals.revenue_this_month_cents} href="/admin/receipts" />
        <Count label="New leads"           n={totals.leads_new}        href="/admin/leads" />
        <Count label="Open proposals"      n={totals.proposals_open}   href="/admin/proposals" />
      </section>

      {stats?.aging && (totals.ar_total_cents || 0) > 0 ? (
        <section className="surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">A/R aging</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["current_cents", "Current"],
              ["d30_cents", "1–30 days"],
              ["d60_cents", "31–60 days"],
              ["d90_cents", "60+ days"],
            ].map(([k, l]) => (
              <div key={k}>
                <div className="text-xs text-muted">{l}</div>
                <div className="mt-1 font-display text-xl">{formatMoney(stats.aging[k])}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(totals.docs_expiring_soon || 0) > 0 ? (
        <section className="surface p-4 border-amber-300 border">
          <Link href="/admin/documents" className="block hover:text-accent">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-700">Action needed</span>
            <div className="mt-1 text-sm">
              <strong>{totals.docs_expiring_soon}</strong> document{totals.docs_expiring_soon === 1 ? "" : "s"} expiring in the next 30 days →
            </div>
          </Link>
        </section>
      ) : null}

      {stats?.by_state?.length ? (
        <section className="surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">By state</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {stats.by_state.map((row) => (
              <Link
                key={row.state}
                href={`/admin/devices?state=${row.state}`}
                className="inline-flex items-center gap-2 rounded-full border hairline px-3 py-1.5 hover:bg-ink/5"
              >
                <StateChip state={row.state} />
                <span className="font-mono text-xs">{row.n}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-px bg-ink/[0.08] border hairline sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group bg-paper p-6 transition hover:bg-ink/[0.02]">
            <div className="font-display text-lg font-medium tracking-tight">{t.label}</div>
            <div className="mt-1 text-sm text-muted">{t.sub}</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition">
              Open →
            </div>
          </Link>
        ))}
      </section>

      <section className="surface p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">System</div>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-muted">API</div>
            <div className="font-mono">{health?.ok ? "healthy" : (err || "checking…")}</div>
          </div>
          <div>
            <div className="text-muted">D1</div>
            <div className="font-mono">{health?.db || "—"}</div>
          </div>
          <div>
            <div className="text-muted">R2</div>
            <div className="font-mono">{health?.filesBound ? "bound" : "—"}</div>
          </div>
          <div>
            <div className="text-muted">Access user</div>
            <div className="font-mono">{health?.accessUser || "anonymous"}</div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          Last refresh: {formatDate(health?.timestamp)}. See <code>ADMIN_SETUP.md</code> if anything is unbound.
        </p>
      </section>
    </div>
  );
}

function Money({ label, cents, href, accent }) {
  return (
    <Link href={href} className="bg-paper p-5 hover:bg-ink/[0.02]">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className={`mt-2 font-display text-2xl tracking-tight ${accent ? "text-accent" : ""}`}>
        {formatMoney(cents || 0)}
      </div>
    </Link>
  );
}

function Count({ label, n, href }) {
  return (
    <Link href={href} className="bg-paper p-5 hover:bg-ink/[0.02]">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl tracking-tight">{n ?? 0}</div>
    </Link>
  );
}
