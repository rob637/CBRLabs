"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const STATUSES = ["DRAFT","SENT","PARTIAL","PAID","VOID"];

export default function InvoicesPage() {
  const [list, setList] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pos, setPos] = useState([]);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  const load = () =>
    api.get("/api/invoices").then((d) => setList(d.invoices || [])).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
    api.get("/api/customers").then((d) => setCustomers(d.customers || [])).catch(() => {});
    api.get("/api/pos").then((d) => setPos(d.purchase_orders || [])).catch(() => {});
  }, []);

  const filtered = list?.filter((p) => !filter || p.status === filter) || [];

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Invoices"
        sub="Bill customers. Auto-marked paid when receipts cover the total."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ New invoice"}
          </button>
        }
      />

      {showForm ? <InvoiceForm customers={customers} pos={pos} onSaved={() => { setShowForm(false); load(); }} /> : null}

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
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">No invoices.</td></tr>
            ) : filtered.map((p) => {
              const paid = p.paid_cents || 0;
              const balance = Math.max(0, (p.total_cents || 0) - paid);
              return (
                <tr key={p.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 font-mono">
                    <Link href={`/admin/invoices/view?id=${p.id}`} className="text-ink hover:text-accent">{p.invoice_number}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/view?id=${p.customer_id}`} className="hover:text-accent">{p.customer_name}</Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">{p.status}</td>
                  <td className="px-4 py-3 font-mono text-xs text-right">{formatMoney(p.total_cents)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-right">{formatMoney(paid)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-right font-semibold">{formatMoney(balance)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.issue_date || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.due_date || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoiceForm({ customers, pos, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [poId, setPoId] = useState("");
  const [fromPo, setFromPo] = useState(true);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  // Keep due date locked to issue + 30 unless the user manually edits it.
  const [dueTouched, setDueTouched] = useState(false);
  useEffect(() => {
    if (dueTouched || !issueDate) return;
    const d = new Date(issueDate + "T00:00:00");
    if (isNaN(d.getTime())) return;
    d.setDate(d.getDate() + 30);
    setDueDate(d.toISOString().slice(0, 10));
  }, [issueDate, dueTouched]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await api.post("/api/invoices", {
        customer_id: Number(customerId) || null,
        po_id: poId ? Number(poId) : null,
        from_po: poId ? fromPo : false,
        issue_date: issueDate || null,
        due_date: dueDate || null,
      });
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  const filteredPos = customerId ? pos.filter((p) => String(p.customer_id) === String(customerId)) : pos;

  return (
    <form onSubmit={submit} className="mt-6 surface p-5 grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        <span className="eyebrow">Customer *</span>
        <select required value={customerId} onChange={(e) => { setCustomerId(e.target.value); setPoId(""); }}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          <option value="">— select —</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.org ? ` (${c.org})` : ""}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Linked PO (optional)</span>
        <select value={poId} onChange={(e) => setPoId(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          <option value="">— none —</option>
          {filteredPos.map((p) => <option key={p.id} value={p.id}>{p.po_number}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Issue date</span>
        <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Due date</span>
        <input type="date" value={dueDate} onChange={(e) => { setDueTouched(true); setDueDate(e.target.value); }}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      {poId ? (
        <label className="text-sm sm:col-span-2 inline-flex items-center gap-2">
          <input type="checkbox" checked={fromPo} onChange={(e) => setFromPo(e.target.checked)} />
          <span>Auto-create one line per device on this PO (split quoted amount evenly)</span>
        </label>
      ) : null}
      {err ? <div className="sm:col-span-2 text-sm text-red-700">{err}</div> : null}
      <div className="sm:col-span-2">
        <button disabled={busy} className="btn-accent">{busy ? "Creating…" : "Create draft"}</button>
      </div>
    </form>
  );
}
