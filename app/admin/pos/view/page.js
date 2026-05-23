"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDate, formatMoney } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";
import StateChip from "../../_components/StateChip";

const PO_STATUSES = ["OPEN","IN_PROGRESS","READY_TO_INVOICE","INVOICED","PAID","CANCELLED"];

export default function PageWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <POView />
    </Suspense>
  );
}

function POView() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!id) return;
    api.get(`/api/pos/${id}`).then(setData).catch((e) => setErr(e.message));
  };
  useEffect(load, [id]);

  async function setStatus(status) {
    setSaving(true);
    try {
      await api.patch(`/api/pos/${id}`, { status });
      load();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  if (!id) return <div className="text-sm text-muted">Missing ?id</div>;
  if (err) return <div className="surface p-4 text-sm text-red-700">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;

  const po = data.purchase_order;

  return (
    <div>
      <PageHeader
        eyebrow="Purchase order"
        title={po.po_number}
        sub={
          <>
            <Link className="hover:text-accent" href={`/admin/customers/view?id=${po.customer_id}`}>
              {po.customer_name}
            </Link>
            {po.customer_org ? <span className="text-muted"> · {po.customer_org}</span> : null}
          </>
        }
        actions={
          <>
            <Link href={`/admin/intake?po_id=${po.id}`} className="btn-accent">+ Add devices</Link>
            <Link href="/admin/pos" className="btn-ghost">← All POs</Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Status</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PO_STATUSES.map((s) => (
              <button
                key={s}
                disabled={saving || s === po.status}
                onClick={() => setStatus(s)}
                className={`rounded-full border hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${s === po.status ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
              >{s}</button>
            ))}
          </div>

          <div className="rule my-4" />
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted">Quoted</dt><dd className="font-mono">{formatMoney(po.quoted_amount_cents)}</dd>
            <dt className="text-muted">Due</dt><dd className="font-mono">{po.due_date || "—"}</dd>
            <dt className="text-muted">Created</dt><dd className="font-mono text-xs">{formatDate(po.created_at)}</dd>
            <dt className="text-muted">Devices</dt><dd className="font-mono">{data.devices.length}</dd>
          </dl>

          {po.scope_notes ? (
            <>
              <div className="rule my-4" />
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Scope</div>
              <div className="mt-2 whitespace-pre-line text-sm">{po.scope_notes}</div>
            </>
          ) : null}
        </div>

        <div className="surface overflow-hidden lg:col-span-2">
          <div className="px-5 py-3 border-b hairline">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Devices on this PO</div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-2">Tag</th>
                <th className="px-4 py-2">Box</th>
                <th className="px-4 py-2">Model / Serial</th>
                <th className="px-4 py-2">State</th>
                <th className="px-4 py-2">Tech</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {data.devices.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No devices yet on this PO.</td></tr>
              ) : data.devices.map((d) => (
                <tr key={d.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-2 font-mono">
                    <Link className="hover:text-accent" href={`/admin/devices/view?tag=${d.tag}`}>{d.tag}</Link>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted">{d.box_tag || "—"}</td>
                  <td className="px-4 py-2 text-xs">
                    {d.model || "—"}
                    {d.serial_number ? <span className="text-muted"> · {d.serial_number}</span> : null}
                  </td>
                  <td className="px-4 py-2"><StateChip state={d.state} /></td>
                  <td className="px-4 py-2 text-xs text-muted">{d.technician || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
