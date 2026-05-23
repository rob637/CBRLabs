"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const STATUSES = ["DRAFT","SENT","VIEWED","ACCEPTED","REJECTED","EXPIRED","WITHDRAWN"];

export default function ProposalsPage() {
  const [list, setList] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get("/api/proposals").then((d) => setList(d.proposals || [])).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
    api.get("/api/customers").then((d) => setCustomers(d.customers || [])).catch(() => {});
  }, []);

  const filtered = list?.filter((p) => !filter || p.status === filter) || [];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Proposals"
        sub="Send branded proposals. Customer accepts online via share link."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ New proposal"}
          </button>
        }
      />

      {showForm ? <ProposalForm customers={customers} onSaved={() => { setShowForm(false); load(); }} /> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")}
          className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${!filter ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
        >All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${filter === s ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
          >{s}</button>
        ))}
      </div>

      {err ? <div className="mt-4 surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="mt-6 surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Proposal #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Valid until</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">No proposals.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-ink/[0.02]">
                <td className="px-4 py-3 font-mono">
                  <Link href={`/admin/proposals/view?id=${p.id}`} className="text-ink hover:text-accent">{p.proposal_number}</Link>
                </td>
                <td className="px-4 py-3">{p.customer_name || "—"}</td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">{p.status}</td>
                <td className="px-4 py-3 font-mono text-xs text-right">{formatMoney(p.total_cents)}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.valid_until || "—"}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProposalForm({ customers, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("Hardware Redaction Engagement");
  const [scope, setScope] = useState("");
  const [terms, setTerms] = useState("Net 30. 50% deposit on acceptance for orders over $5,000.");
  const [validUntil, setValidUntil] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await api.post("/api/proposals", {
        customer_id: Number(customerId) || null,
        title,
        scope_summary: scope || null,
        terms,
        valid_until: validUntil || null,
        lines: [{ position: 0, description: "Redaction services — see scope", quantity: 1, unit_price_cents: 0 }],
      });
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-6 surface p-5 grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        <span className="eyebrow">Customer *</span>
        <select required value={customerId} onChange={(e) => setCustomerId(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          <option value="">— select —</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="eyebrow">Scope summary</span>
        <textarea value={scope} onChange={(e) => setScope(e.target.value)} rows={3}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="eyebrow">Terms</span>
        <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={2}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Valid until</span>
        <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      {err ? <div className="sm:col-span-2 text-sm text-red-700">{err}</div> : null}
      <div className="sm:col-span-2">
        <button disabled={busy} className="btn-accent">{busy ? "Creating…" : "Create draft"}</button>
      </div>
    </form>
  );
}
