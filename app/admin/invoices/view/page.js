"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDate, formatMoney } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";
import { buildInvoicePDF, downloadDoc } from "../../_components/BrandedPDF";

export default function InvoiceViewWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <InvoiceView />
    </Suspense>
  );
}

function InvoiceView() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const load = () => api.get(`/api/invoices/${id}`).then(setData).catch((e) => setErr(e.message));
  useEffect(() => { if (id) load(); }, [id]);

  // The API returns customer fields flattened onto the invoice row.
  const customer = data ? {
    name:            data.invoice?.customer_name,
    org:             data.invoice?.customer_org,
    email:           data.invoice?.customer_email,
    phone:           data.invoice?.customer_phone,
    billing_address: data.invoice?.billing_address,
  } : null;

  async function downloadPDF() {
    const doc = buildInvoicePDF({
      invoice: { ...data.invoice, paid_cents: data.receipts?.reduce((s, r) => s + (r.amount_cents || 0), 0) || 0 },
      customer,
      lines: data.lines,
    });
    downloadDoc(doc, `${data.invoice.invoice_number || `invoice-${data.invoice.id}`}.pdf`);
  }

  async function setStatus(next) {
    await api.patch(`/api/invoices/${id}`, { status: next });
    load();
  }

  if (err) return <div className="surface p-4 text-sm text-red-700">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;
  const inv = data.invoice;
  const paid = data.receipts?.reduce((s, r) => s + (r.amount_cents || 0), 0) || 0;
  const balance = Math.max(0, (inv.total_cents || 0) - paid);

  // Allowed next states from current status
  const nextStates = ({
    DRAFT:   ["SENT", "VOID"],
    SENT:    ["DRAFT", "VOID"],
    PARTIAL: ["VOID"],
    PAID:    [],
    VOID:    ["DRAFT"],
  })[inv.status] || [];

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Invoice"
        title={inv.invoice_number || `#${inv.id}`}
        sub={`${customer?.name || "—"} · ${inv.status}`}
        actions={
          <div className="flex gap-2">
            <button onClick={downloadPDF} className="btn-accent">Download PDF</button>
            {nextStates.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className="btn-ghost">
                {s === "SENT" ? "Mark sent" : s === "VOID" ? "Void" : s === "DRAFT" ? "Reopen" : `Mark ${s.toLowerCase()}`}
              </button>
            ))}
            <Link href={`/admin/receipts?invoice_id=${inv.id}`} className="btn-ghost">+ Receipt</Link>
          </div>
        }
      />

      <div className="mt-4 surface p-4 text-sm">
        <div className="eyebrow mb-2">Bill to</div>
        <div className="font-medium">{customer?.name || "—"}</div>
        {customer?.org && customer.org !== customer.name ? (
          <div className="font-medium">{customer.org}</div>
        ) : null}
        {customer?.billing_address ? (
          <div className="whitespace-pre-line text-muted">{customer.billing_address}</div>
        ) : null}
        {customer?.email ? <div className="text-muted">{customer.email}</div> : null}
        {customer?.phone ? <div className="text-muted">{customer.phone}</div> : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total" value={formatMoney(inv.total_cents)} />
        <Stat label="Paid"  value={formatMoney(paid)} />
        <Stat label="Balance" value={formatMoney(balance)} accent />
      </div>

      <LineEditor
        invoiceId={id}
        lines={data.lines}
        onSaved={load}
      />

      <div className="mt-8 surface p-5">
        <div className="eyebrow mb-3">Payments</div>
        {data.receipts?.length ? (
          <table className="w-full text-sm">
            <thead className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr><th className="py-2">Date</th><th>Method</th><th>Ref</th><th className="text-right">Amount</th></tr>
            </thead>
            <tbody className="divide-y hairline">
              {data.receipts.map((r) => (
                <tr key={r.id}>
                  <td className="py-2 font-mono text-xs">{r.received_at?.slice(0,10)}</td>
                  <td className="py-2 font-mono text-xs">{r.method}</td>
                  <td className="py-2 font-mono text-xs text-muted">{r.reference || "—"}</td>
                  <td className="py-2 font-mono text-xs text-right">{formatMoney(r.amount_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="text-sm text-muted">No payments yet.</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="surface p-4">
      <div className="eyebrow">{label}</div>
      <div className={`mt-1 font-display text-2xl tracking-tightest ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function centsToDollarStr(c) {
  const n = Number(c) || 0;
  return (n / 100).toFixed(2);
}
function dollarStrToCents(s) {
  const n = parseFloat(String(s).replace(/[^0-9.\-]/g, ""));
  if (!isFinite(n)) return 0;
  return Math.round(n * 100);
}

function LineEditor({ invoiceId, lines: initial, onSaved }) {
  // Internal line shape: { description, quantity, _price_dollars (string for input), unit_price_cents }
  const toEditable = (ls) => (ls || []).map((l) => ({
    ...l,
    _price_dollars: centsToDollarStr(l.unit_price_cents),
  }));
  const [lines, setLines] = useState(toEditable(initial));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => { setLines(toEditable(initial)); }, [initial]);

  function update(i, patch) {
    setLines((ls) => ls.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }
  function add() {
    setLines((ls) => [...ls, { description: "", quantity: 1, unit_price_cents: 0, _price_dollars: "0.00" }]);
  }
  function remove(i) {
    setLines((ls) => ls.filter((_, idx) => idx !== i));
  }

  async function save() {
    setBusy(true); setErr(null);
    try {
      await api.patch(`/api/invoices/${invoiceId}`, {
        lines: lines.map((l, i) => ({
          position: i,
          description: l.description,
          quantity: Number(l.quantity) || 1,
          unit_price_cents: dollarStrToCents(l._price_dollars),
        })),
      });
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="mt-8 surface p-5">
      <div className="flex items-center justify-between">
        <div className="eyebrow">Line items</div>
        <button onClick={add} className="btn-ghost text-xs">+ Add line</button>
      </div>
      <div className="mt-3 space-y-2">
        {lines.map((l, i) => {
          const priceCents = dollarStrToCents(l._price_dollars);
          const amt = (Number(l.quantity) || 0) * priceCents;
          return (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr,80px,140px,120px,40px] items-center">
              <input value={l.description || ""} onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Description"
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm" />
              <input type="number" step="1" min="1" value={l.quantity ?? 1} onChange={(e) => update(i, { quantity: e.target.value })}
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm font-mono text-right" />
              <input type="number" step="0.01" min="0" value={l._price_dollars} onChange={(e) => update(i, { _price_dollars: e.target.value })}
                placeholder="0.00"
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm font-mono text-right" />
              <div className="font-mono text-xs text-right">{formatMoney(amt)}</div>
              <button onClick={() => remove(i)} className="text-muted hover:text-red-700">×</button>
            </div>
          );
        })}
      </div>
      {err ? <div className="mt-3 text-sm text-red-700">{err}</div> : null}
      <div className="mt-4 flex justify-end gap-2">
        <button disabled={busy} onClick={save} className="btn-accent">{busy ? "Saving…" : "Save lines"}</button>
      </div>
    </div>
  );
}
