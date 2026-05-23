"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDate, formatMoney } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const PO_STATUSES = ["OPEN","IN_PROGRESS","READY_TO_INVOICE","INVOICED","PAID","CANCELLED"];

export default function POsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <POsPage />
    </Suspense>
  );
}

function POsPage() {
  const sp = useSearchParams();
  const preCustomer = sp.get("customer_id");
  const [list, setList] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(!!preCustomer);
  const [filter, setFilter] = useState("");

  const load = () =>
    api.get("/api/pos").then((d) => setList(d.purchase_orders || [])).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
    api.get("/api/customers").then((d) => setCustomers(d.customers || [])).catch(() => {});
  }, []);

  const filtered = list?.filter((p) => !filter || p.status === filter) || [];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Purchase orders"
        sub="Each PO scopes the work for one or more devices."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ New PO"}
          </button>
        }
      />

      {showForm ? (
        <POForm
          customers={customers}
          defaultCustomerId={preCustomer ? Number(preCustomer) : null}
          onSaved={() => { setShowForm(false); load(); }}
        />
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${!filter ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
        >All</button>
        {PO_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${filter === s ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
          >{s}</button>
        ))}
      </div>

      {err ? <div className="mt-4 surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="mt-6 surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">PO #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Devices</th>
              <th className="px-4 py-3">Quoted</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">No POs.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-ink/[0.02]">
                <td className="px-4 py-3 font-mono">
                  <Link href={`/admin/pos/view?id=${p.id}`} className="text-ink hover:text-accent">{p.po_number}</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/view?id=${p.customer_id}`} className="hover:text-accent">{p.customer_name}</Link>
                  {p.customer_org ? <div className="text-xs text-muted">{p.customer_org}</div> : null}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">{p.status}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.device_count ?? 0}</td>
                <td className="px-4 py-3 font-mono text-xs">{formatMoney(p.quoted_amount_cents)}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.due_date || "—"}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function POForm({ customers, defaultCustomerId, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      customer_id: Number(fd.get("customer_id")),
      scope_notes: fd.get("scope_notes") || null,
      quoted_amount_cents: fd.get("quoted_amount")
        ? Math.round(Number(fd.get("quoted_amount")) * 100)
        : null,
      due_date: fd.get("due_date") || null,
    };
    try {
      await api.post("/api/pos", body);
      onSaved?.();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="surface mt-4 grid gap-4 p-5 sm:grid-cols-2">
      <label className="text-xs text-muted sm:col-span-2">
        Customer *
        <select
          name="customer_id"
          required
          defaultValue={defaultCustomerId || ""}
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
        >
          <option value="">— select —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}{c.org ? ` (${c.org})` : ""}</option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted">
        Quoted amount (USD)
        <input
          name="quoted_amount"
          type="number"
          step="0.01"
          min="0"
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
        />
      </label>
      <label className="text-xs text-muted">
        Due date
        <input
          name="due_date"
          type="date"
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
        />
      </label>
      <label className="text-xs text-muted sm:col-span-2">
        Scope notes
        <textarea
          name="scope_notes"
          rows={3}
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
          placeholder="e.g. 20× iPad Air A2602, remove all radios + mic + cameras, return by 2026-Q1"
        />
      </label>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-accent">{busy ? "Saving…" : "Create PO"}</button>
        {err ? <span className="text-sm text-red-600">{err}</span> : null}
      </div>
    </form>
  );
}
