"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api, REDACTIONS } from "../_components/api";
import PageHeader from "../_components/PageHeader";

export default function IntakePageWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <IntakePage />
    </Suspense>
  );
}

function IntakePage() {
  const sp = useSearchParams();
  const preCustomerId = sp.get("customer_id");
  const prePoId = sp.get("po_id");

  const [customers, setCustomers] = useState([]);
  const [pos, setPos] = useState([]);
  const [customerId, setCustomerId] = useState(preCustomerId || "");
  const [poId, setPoId] = useState(prePoId || "");
  const [platform, setPlatform] = useState("iPad");
  const [defaultModel, setDefaultModel] = useState("");
  const [redactions, setRedactions] = useState(["CAMERA","MIC","WIFI","BT","CELL"]);
  const [boxTag, setBoxTag] = useState("");
  const [rows, setRows] = useState([{ serial_number: "", model: "", notes: "" }]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get("/api/customers").then((d) => setCustomers(d.customers || [])).catch(() => {});
  }, []);
  useEffect(() => {
    if (!customerId) { setPos([]); return; }
    api.get(`/api/pos?customer_id=${customerId}`).then((d) => setPos(d.purchase_orders || [])).catch(() => {});
  }, [customerId]);

  function toggleRedaction(r) {
    setRedactions((cur) => cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]);
  }
  function updateRow(i, patch) {
    setRows((r) => r.map((row, idx) => idx === i ? { ...row, ...patch } : row));
  }
  function addRow() { setRows((r) => [...r, { serial_number: "", model: "", notes: "" }]); }
  function removeRow(i) { setRows((r) => r.length === 1 ? r : r.filter((_, idx) => idx !== i)); }

  async function submit(e) {
    e.preventDefault();
    if (!customerId) { setErr("Choose a customer"); return; }
    setBusy(true); setErr(null);
    try {
      const data = await api.post("/api/devices", {
        customer_id: Number(customerId),
        po_id: poId ? Number(poId) : null,
        box_tag: boxTag || null,
        platform,
        default_model: defaultModel || null,
        redactions,
        devices: rows.map((r) => ({
          model: r.model || defaultModel || null,
          serial_number: r.serial_number || null,
          notes: r.notes || null,
        })),
      });
      setResult(data.devices || []);
      setRows([{ serial_number: "", model: "", notes: "" }]);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="New intake"
        sub="Receive devices, mint tags, and start the chain of custody."
        actions={result?.length ? (
          <Link
            href={`/admin/labels?tags=${result.map((d) => d.tag).join(",")}`}
            className="btn-accent"
          >
            Print labels for {result.length} tag{result.length === 1 ? "" : "s"} →
          </Link>
        ) : null}
      />

      {result?.length ? (
        <div className="surface mb-6 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700">Created</div>
          <ul className="mt-3 grid gap-1 font-mono text-sm">
            {result.map((d) => (
              <li key={d.id}>
                <Link href={`/admin/devices/view?tag=${d.tag}`} className="text-ink hover:text-accent">{d.tag}</Link>
                {d.model || d.serial_number ? (
                  <span className="text-muted"> — {d.model || ""}{d.serial_number ? ` · ${d.serial_number}` : ""}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-6">
        <section className="surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">1 · Customer &amp; PO</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-muted">
              Customer *
              <div className="mt-1 flex gap-2">
                <select
                  required
                  value={customerId}
                  onChange={(e) => { setCustomerId(e.target.value); setPoId(""); }}
                  className="flex-1 rounded-lg border bg-paper px-3 py-2 text-sm hairline"
                >
                  <option value="">— select customer —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.org ? ` (${c.org})` : ""}</option>
                  ))}
                </select>
                <Link href="/admin/customers" className="btn-ghost text-xs">+ New</Link>
              </div>
            </label>
            <label className="text-xs text-muted">
              Purchase order (optional)
              <div className="mt-1 flex gap-2">
                <select
                  value={poId}
                  onChange={(e) => setPoId(e.target.value)}
                  className="flex-1 rounded-lg border bg-paper px-3 py-2 text-sm hairline"
                  disabled={!customerId}
                >
                  <option value="">— none —</option>
                  {pos.map((p) => (
                    <option key={p.id} value={p.id}>{p.po_number} ({p.status})</option>
                  ))}
                </select>
                <Link href={`/admin/pos${customerId ? `?customer_id=${customerId}` : ""}`} className="btn-ghost text-xs">+ New</Link>
              </div>
            </label>
            <label className="text-xs text-muted">
              Box tag (optional, for chain-of-custody)
              <input
                value={boxTag}
                onChange={(e) => setBoxTag(e.target.value)}
                placeholder="e.g. CBR-BOX-2026-0007"
                className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
              />
            </label>
            <label className="text-xs text-muted">
              Platform
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
              >
                <option>iPad</option>
                <option>Android</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-xs text-muted sm:col-span-2">
              Default model (applied to rows without one)
              <input
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                placeholder="e.g. iPad Air (5th gen) A2588"
                className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
              />
            </label>
          </div>
        </section>

        <section className="surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">2 · Redactions (applies to all)</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {REDACTIONS.map(([code, label]) => {
              const on = redactions.includes(code);
              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => toggleRedaction(code)}
                  className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${on ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
                >{on ? "✓ " : ""}{label}</button>
              );
            })}
          </div>
        </section>

        <section className="surface p-5">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">3 · Devices ({rows.length})</div>
            <button type="button" onClick={addRow} className="btn-ghost text-xs">+ Add row</button>
          </div>
          <div className="mt-4 grid gap-2">
            {rows.map((r, i) => (
              <div key={i} className="grid items-center gap-2 sm:grid-cols-[40px_1fr_1fr_2fr_auto]">
                <div className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</div>
                <input
                  value={r.model}
                  onChange={(e) => updateRow(i, { model: e.target.value })}
                  placeholder="Model (override)"
                  className="rounded-lg border bg-paper px-3 py-2 text-sm hairline"
                />
                <input
                  value={r.serial_number}
                  onChange={(e) => updateRow(i, { serial_number: e.target.value })}
                  placeholder="Serial #"
                  className="rounded-lg border bg-paper px-3 py-2 text-sm font-mono hairline"
                />
                <input
                  value={r.notes}
                  onChange={(e) => updateRow(i, { notes: e.target.value })}
                  placeholder="Notes (cracked screen, missing cable…)"
                  className="rounded-lg border bg-paper px-3 py-2 text-sm hairline"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  disabled={rows.length === 1}
                  className="rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:bg-ink/5 disabled:opacity-30"
                >Remove</button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Don&apos;t have serials yet? Leave them blank — you can update each device after scanning its sticker.
          </p>
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy} className="btn-accent">
            {busy ? "Receiving…" : `Receive ${rows.length} device${rows.length === 1 ? "" : "s"} →`}
          </button>
          {err ? <span className="text-sm text-red-600">{err}</span> : null}
        </div>
      </form>
    </div>
  );
}
