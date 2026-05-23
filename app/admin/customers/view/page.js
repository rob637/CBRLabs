"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDate, formatMoney } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";
import StateChip from "../../_components/StateChip";

// Wrap in Suspense for useSearchParams in static export.
export default function CustomerViewWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <CustomerView />
    </Suspense>
  );
}

function CustomerView() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/customers/${id}`).then(setData).catch((e) => setErr(e.message));
  }, [id]);

  if (!id) return <div className="text-sm text-muted">Missing ?id</div>;
  if (err) return <div className="surface p-4 text-sm text-red-700">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;

  const c = data.customer;
  return (
    <div>
      <PageHeader
        eyebrow="Customer"
        title={c.name}
        sub={c.org || null}
        actions={
          <Link href="/admin/customers" className="btn-ghost">← All customers</Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Contact</div>
          <div className="mt-3 grid gap-2 text-sm">
            <div>{c.email ? <a className="hover:text-accent" href={`mailto:${c.email}`}>{c.email}</a> : <span className="text-muted">No email</span>}</div>
            <div>{c.phone || <span className="text-muted">No phone</span>}</div>
            <div className="whitespace-pre-line text-muted">{c.billing_address || "—"}</div>
          </div>
          {c.notes ? (
            <>
              <div className="rule my-4" />
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Notes</div>
              <div className="mt-2 whitespace-pre-line text-sm">{c.notes}</div>
            </>
          ) : null}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b hairline">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Purchase orders</div>
              <Link href={`/admin/pos?customer_id=${c.id}`} className="text-xs text-accent hover:underline">+ New PO</Link>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-2">PO #</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Quoted</th>
                  <th className="px-4 py-2">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y hairline">
                {data.purchase_orders.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-muted">No POs yet.</td></tr>
                ) : data.purchase_orders.map((p) => (
                  <tr key={p.id} className="hover:bg-ink/[0.02]">
                    <td className="px-4 py-2 font-mono">
                      <Link className="hover:text-accent" href={`/admin/pos/view?id=${p.id}`}>{p.po_number}</Link>
                    </td>
                    <td className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em]">{p.status}</td>
                    <td className="px-4 py-2 font-mono text-xs">{formatMoney(p.quoted_amount_cents)}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted">{p.due_date || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="surface overflow-hidden">
            <div className="px-5 py-3 border-b hairline">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Devices</div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-2">Tag</th>
                  <th className="px-4 py-2">Model / Serial</th>
                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y hairline">
                {data.devices.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-muted">No devices yet.</td></tr>
                ) : data.devices.map((d) => (
                  <tr key={d.id} className="hover:bg-ink/[0.02]">
                    <td className="px-4 py-2 font-mono">
                      <Link className="hover:text-accent" href={`/admin/devices/view?tag=${d.tag}`}>{d.tag}</Link>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {d.model || "—"}
                      {d.serial_number ? <span className="text-muted"> · {d.serial_number}</span> : null}
                    </td>
                    <td className="px-4 py-2"><StateChip state={d.state} /></td>
                    <td className="px-4 py-2 font-mono text-[11px] text-muted">{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
