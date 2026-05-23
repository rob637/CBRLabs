"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDate, formatMoney } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const METHODS = ["CHECK","ACH","WIRE","CARD","CASH","OTHER"];

export default function ReceiptsWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <ReceiptsPage />
    </Suspense>
  );
}

function ReceiptsPage() {
  const sp = useSearchParams();
  const preInvoice = sp.get("invoice_id");
  const [list, setList] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(!!preInvoice);

  const load = () =>
    api.get("/api/receipts").then((d) => setList(d.receipts || [])).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
    api.get("/api/invoices").then((d) => setInvoices(d.invoices || [])).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Cash receipts"
        sub="Logging a receipt automatically marks the invoice paid/partial."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ Record payment"}
          </button>
        }
      />

      {showForm ? (
        <ReceiptForm invoices={invoices} defaultInvoiceId={preInvoice}
          onSaved={() => { setShowForm(false); load(); }} />
      ) : null}

      {err ? <div className="mt-4 surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="mt-6 surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">No receipts.</td></tr>
            ) : list.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs">{r.received_at?.slice(0,10)}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.invoice_number || "—"}</td>
                <td className="px-4 py-3">{r.customer_name || "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.method}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{r.reference || "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-right">{formatMoney(r.amount_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReceiptForm({ invoices, defaultInvoiceId, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [invoiceId, setInvoiceId] = useState(defaultInvoiceId || "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CHECK");
  const [reference, setReference] = useState("");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await api.post("/api/receipts", {
        invoice_id: invoiceId ? Number(invoiceId) : null,
        amount_cents: Math.round(parseFloat(amount) * 100),
        method,
        reference: reference || null,
        received_at: receivedAt,
        notes: notes || null,
      });
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-6 surface p-5 grid gap-3 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">
        <span className="eyebrow">Invoice</span>
        <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          <option value="">— unlinked —</option>
          {invoices.map((i) => (
            <option key={i.id} value={i.id}>
              {i.invoice_number} · {i.customer_name} · {formatMoney(i.total_cents)} · {i.status}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Amount (USD)</span>
        <input required type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2 font-mono" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Method</span>
        <select value={method} onChange={(e) => setMethod(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Received on</span>
        <input type="date" value={receivedAt} onChange={(e) => setReceivedAt(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Reference (check #, txn id)</span>
        <input value={reference} onChange={(e) => setReference(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2 font-mono" />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="eyebrow">Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      {err ? <div className="sm:col-span-2 text-sm text-red-700">{err}</div> : null}
      <div className="sm:col-span-2">
        <button disabled={busy} className="btn-accent">{busy ? "Saving…" : "Record payment"}</button>
      </div>
    </form>
  );
}
