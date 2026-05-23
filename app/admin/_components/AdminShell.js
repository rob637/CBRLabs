"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "../../../components/Wordmark";

const nav = [
  { href: "/admin",          label: "Dashboard" },
  { href: "/admin/intake",   label: "Intake" },
  { href: "/admin/devices",  label: "Devices" },
  { href: "/admin/scan",     label: "Scan" },
  { href: "/admin/labels",   label: "Labels" },
  { href: "/admin/customers",label: "Customers" },
  { href: "/admin/pos",      label: "POs" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/receipts", label: "Cash receipts" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/documents",label: "Documents" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => { setHealth(d); setUser(d.accessUser); })
      .catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="border-b hairline">
        <div className="container-xl flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4">
            <Wordmark />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              · Admin
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <HealthDot health={health} />
            <span>{user || "anonymous"}</span>
            <Link href="/" className="rounded-full border hairline px-3 py-1.5 hover:bg-ink/5">
              Exit admin
            </Link>
          </div>
        </div>
      </header>

      <div className="container-xl flex-1 grid gap-8 py-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="flex flex-wrap gap-1 lg:flex-col lg:gap-0.5 font-mono text-[11px] uppercase tracking-[0.14em]">
            {nav.map(({ href, label }) => {
              const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-2 transition ${
                    active
                      ? "bg-ink text-paper"
                      : "text-muted hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t hairline">
        <div className="container-xl py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Internal use only · No data leaves CBR Labs systems
        </div>
      </footer>
    </div>
  );
}

function HealthDot({ health }) {
  if (!health) return <span className="opacity-50">checking…</span>;
  if (health.ok && health.db === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> healthy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {health.db || "no-api"}
    </span>
  );
}
