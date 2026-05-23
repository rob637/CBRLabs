"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const tiles = [
  { href: "/admin/intake",   label: "New intake",        sub: "Receive a device or box" },
  { href: "/admin/scan",     label: "Scan QR",           sub: "Open camera, jump to record" },
  { href: "/admin/devices",  label: "Devices on bench",  sub: "Active work queue" },
  { href: "/admin/invoices", label: "Create invoice",    sub: "Bill a completed PO" },
  { href: "/admin/expenses", label: "Log an expense",    sub: "Upload a receipt" },
  { href: "/admin/documents",label: "Documents vault",   sub: "COI, CAGE, NDAs" },
];

export default function AdminDashboard() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
  }, []);

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
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group bg-paper p-6 transition hover:bg-ink/[0.02]"
          >
            <div className="font-display text-lg font-medium tracking-tight">{t.label}</div>
            <div className="mt-1 text-sm text-muted">{t.sub}</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent opacity-0 group-hover:opacity-100 transition">
              Open →
            </div>
          </Link>
        ))}
      </section>

      <section className="surface p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          System status
        </div>
        <pre className="mt-3 overflow-auto text-xs leading-relaxed text-ink/80">
{health ? JSON.stringify(health, null, 2) : "…"}
        </pre>
        <p className="mt-3 text-xs text-muted">
          If <code>db</code> is <code>unbound</code> or <code>error</code>, finish the steps in{" "}
          <code>ADMIN_SETUP.md</code>: provision D1, paste the database id into{" "}
          <code>wrangler.toml</code>, then bind it on the Cloudflare Pages project.
        </p>
      </section>
    </div>
  );
}
