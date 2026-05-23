"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, STATES, formatDate } from "../_components/api";
import PageHeader from "../_components/PageHeader";
import StateChip from "../_components/StateChip";

export default function DevicesPageWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <DevicesPage />
    </Suspense>
  );
}

function DevicesPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const stateFilter = sp.get("state") || "";
  const q = sp.get("q") || "";
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    const qs = new URLSearchParams();
    if (stateFilter) qs.set("state", stateFilter);
    if (q) qs.set("q", q);
    api.get(`/api/devices?${qs}`)
      .then((d) => setList(d.devices || []))
      .catch((e) => setErr(e.message));
  }, [stateFilter, q]);

  function setParam(k, v) {
    const next = new URLSearchParams(sp.toString());
    if (v) next.set(k, v); else next.delete(k);
    router.push(`/admin/devices${next.toString() ? "?" + next.toString() : ""}`);
  }

  function toggleSel(tag) {
    setSelected((cur) => {
      const next = new Set(cur);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  const selectedTags = useMemo(() => Array.from(selected), [selected]);

  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title="Devices"
        sub={list ? `${list.length} record${list.length === 1 ? "" : "s"}` : "Loading…"}
        actions={
          <>
            {selectedTags.length ? (
              <Link href={`/admin/labels?tags=${selectedTags.join(",")}`} className="btn-accent">
                Print {selectedTags.length} label{selectedTags.length === 1 ? "" : "s"} →
              </Link>
            ) : null}
            <Link href="/admin/intake" className="btn-ghost">+ Intake</Link>
          </>
        }
      />

      <div className="surface mb-4 flex flex-wrap items-center gap-2 p-3">
        <input
          defaultValue={q}
          placeholder="Search tag, serial, model…"
          onKeyDown={(e) => { if (e.key === "Enter") setParam("q", e.currentTarget.value); }}
          className="flex-1 min-w-[200px] rounded-lg border bg-paper px-3 py-2 text-sm hairline"
        />
        <button
          onClick={() => setParam("state", "")}
          className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${!stateFilter ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
        >All states</button>
        {STATES.map((s) => (
          <button
            key={s}
            onClick={() => setParam("state", s)}
            className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${stateFilter === s ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
          >{s}</button>
        ))}
      </div>

      {err ? <div className="surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-3 py-3 w-8"></th>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Customer / PO</th>
              <th className="px-4 py-3">Model / Serial</th>
              <th className="px-4 py-3">Box</th>
              <th className="px-4 py-3">Tech</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">No devices match.</td></tr>
            ) : list.map((d) => (
              <tr key={d.id} className="hover:bg-ink/[0.02]">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(d.tag)}
                    onChange={() => toggleSel(d.tag)}
                    className="h-4 w-4 accent-ink"
                  />
                </td>
                <td className="px-4 py-2 font-mono">
                  <Link href={`/admin/devices/view?tag=${d.tag}`} className="text-ink hover:text-accent">{d.tag}</Link>
                </td>
                <td className="px-4 py-2"><StateChip state={d.state} /></td>
                <td className="px-4 py-2">
                  {d.customer_name ? (
                    <Link href={`/admin/customers/view?id=${d.customer_id}`} className="hover:text-accent">{d.customer_name}</Link>
                  ) : <span className="text-muted">—</span>}
                  {d.po_number ? (
                    <div className="font-mono text-[10px] text-muted">
                      <Link href={`/admin/pos/view?id=${d.po_id}`} className="hover:text-accent">{d.po_number}</Link>
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-2 text-xs">
                  {d.model || "—"}
                  {d.serial_number ? <span className="text-muted"> · {d.serial_number}</span> : null}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted">{d.box_tag || "—"}</td>
                <td className="px-4 py-2 text-xs text-muted">{d.technician || "—"}</td>
                <td className="px-4 py-2 font-mono text-[11px] text-muted">{formatDate(d.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
