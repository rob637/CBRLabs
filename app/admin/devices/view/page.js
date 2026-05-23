"use client";

import Link from "next/link";
import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api, STATES, REDACTIONS, formatDate } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";
import StateChip from "../../_components/StateChip";
import QRCanvas from "../../_components/QRCanvas";
import PhotoUpload from "../../_components/PhotoUpload";

const NEXT_STATE = {
  RECEIVED:    ["INTAKE","HOLD"],
  INTAKE:      ["IN_QUEUE","HOLD"],
  IN_QUEUE:    ["ON_BENCH","HOLD"],
  ON_BENCH:    ["REDACTED","HOLD"],
  REDACTED:    ["VERIFIED","ON_BENCH","HOLD"],
  VERIFIED:    ["CERT_ISSUED","ON_BENCH","HOLD"],
  CERT_ISSUED: ["PACKED","HOLD"],
  PACKED:      ["SHIPPED","HOLD"],
  SHIPPED:     ["DELIVERED","RETURNED"],
  DELIVERED:   ["RETURNED"],
  HOLD:        ["IN_QUEUE","ON_BENCH","RETURNED"],
  RETURNED:    [],
};

export default function DeviceViewWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <DeviceView />
    </Suspense>
  );
}

function DeviceView() {
  const sp = useSearchParams();
  const tag = sp.get("tag");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    if (!tag) return;
    api.get(`/api/devices/${encodeURIComponent(tag)}`).then(setData).catch((e) => setErr(e.message));
  }, [tag]);
  useEffect(load, [load]);

  if (!tag) return <div className="text-sm text-muted">Missing ?tag</div>;
  if (err) return <div className="surface p-4 text-sm text-red-700">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;

  const d = data.device;
  const qrUrl = typeof window !== "undefined" ? `${window.location.origin}/admin/devices/view?tag=${d.tag}` : "";
  const next = NEXT_STATE[d.state] || [];

  async function advance(toState) {
    const note = window.prompt(`Advance to ${toState}. Optional note?`);
    if (note === null) return;
    setBusy(true);
    try {
      await api.post(`/api/devices/${encodeURIComponent(d.tag)}/state`, {
        to_state: toState,
        note: note || null,
      });
      load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Device"
        title={d.tag}
        sub={<><StateChip state={d.state} /> {d.cert_number ? <span className="ml-2 font-mono text-xs text-muted">Cert · {d.cert_number}</span> : null}</>}
        actions={
          <>
            <Link href={`/admin/labels?tags=${d.tag}`} className="btn-ghost">Print label</Link>
            <Link href="/admin/devices" className="btn-ghost">← Devices</Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: QR + state advance */}
        <div className="space-y-6 lg:col-span-1">
          <div className="surface flex flex-col items-center p-5">
            <QRCanvas text={qrUrl} size={200} />
            <div className="mt-3 font-mono text-sm">{d.tag}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted text-center break-all">
              {qrUrl}
            </div>
          </div>

          <div className="surface p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Advance state</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {next.length === 0 ? (
                <span className="text-xs text-muted">Terminal state.</span>
              ) : next.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => advance(s)}
                  className="rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ink/5 disabled:opacity-40"
                >→ {s}</button>
              ))}
            </div>
            <div className="rule my-4" />
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Override</div>
            <select
              disabled={busy}
              onChange={(e) => { if (e.target.value) advance(e.target.value); e.target.value = ""; }}
              className="mt-2 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
            >
              <option value="">Jump to any state…</option>
              {STATES.filter((s) => s !== d.state).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <DeviceFacts device={d} editing={editing} setEditing={setEditing} onSaved={load} />
        </div>

        {/* RIGHT: photos + chain of custody */}
        <div className="space-y-6 lg:col-span-2">
          <PhotoUpload tag={d.tag} onUploaded={load} />

          {data.photos.length ? (
            <div className="surface p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Photos · {data.photos.length}</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {data.photos.map((p) => (
                  <a key={p.id} href={`/api/photos/${p.id}`} target="_blank" rel="noreferrer" className="block group">
                    <div className="relative aspect-square overflow-hidden rounded-lg border hairline bg-ink/5">
                      <img src={`/api/photos/${p.id}`} alt={p.caption || p.phase} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      <span>{p.phase}</span>
                      <span>{formatDate(p.uploaded_at)}</span>
                    </div>
                    {p.caption ? <div className="text-xs text-ink mt-0.5 line-clamp-2">{p.caption}</div> : null}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="surface overflow-hidden">
            <div className="px-5 py-3 border-b hairline">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Chain of custody · {data.events.length} event{data.events.length === 1 ? "" : "s"}</div>
            </div>
            <ol className="divide-y hairline">
              {data.events.length === 0 ? (
                <li className="px-5 py-4 text-sm text-muted">No events yet.</li>
              ) : data.events.map((ev) => {
                let payload = null;
                try { payload = ev.payload ? JSON.parse(ev.payload) : null; } catch { /* ignore */ }
                return (
                  <li key={ev.id} className="px-5 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{ev.event_type}</span>
                      {ev.from_state || ev.to_state ? (
                        <span className="font-mono text-[10px] text-muted">
                          {ev.from_state || "·"} → <strong className="text-ink">{ev.to_state || "·"}</strong>
                        </span>
                      ) : null}
                      <span className="ml-auto font-mono text-[10px] text-muted">{formatDate(ev.occurred_at)}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted">{ev.actor}</div>
                    {payload && Object.keys(payload).length ? (
                      <pre className="mt-2 overflow-x-auto rounded bg-ink/[0.04] p-2 text-[11px] leading-snug">
{JSON.stringify(payload, null, 2)}
                      </pre>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceFacts({ device: d, editing, setEditing, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      model: fd.get("model") || null,
      serial_number: fd.get("serial_number") || null,
      imei: fd.get("imei") || null,
      technician: fd.get("technician") || null,
      box_tag: fd.get("box_tag") || null,
      notes: fd.get("notes") || null,
      redactions: REDACTIONS.map(([c]) => c).filter((c) => fd.get(`r_${c}`) === "on"),
    };
    try {
      await api.patch(`/api/devices/${encodeURIComponent(d.tag)}`, body);
      setEditing(false);
      onSaved?.();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  if (!editing) {
    return (
      <div className="surface p-5">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Facts</div>
          <button onClick={() => setEditing(true)} className="text-xs text-accent hover:underline">Edit</button>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted">Platform</dt><dd className="font-mono">{d.platform || "—"}</dd>
          <dt className="text-muted">Model</dt><dd className="font-mono">{d.model || "—"}</dd>
          <dt className="text-muted">Serial</dt><dd className="font-mono break-all">{d.serial_number || "—"}</dd>
          <dt className="text-muted">IMEI</dt><dd className="font-mono break-all">{d.imei || "—"}</dd>
          <dt className="text-muted">Box</dt><dd className="font-mono">{d.box_tag || "—"}</dd>
          <dt className="text-muted">Tech</dt><dd className="font-mono">{d.technician || "—"}</dd>
        </dl>
        {d.redactions?.length ? (
          <>
            <div className="rule my-3" />
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Redactions</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {d.redactions.map((r) => (
                <span key={r} className="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{r}</span>
              ))}
            </div>
          </>
        ) : null}
        {d.notes ? (
          <>
            <div className="rule my-3" />
            <div className="text-xs whitespace-pre-line">{d.notes}</div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="surface p-5 space-y-3">
      <Inp name="model" label="Model" defaultValue={d.model} />
      <Inp name="serial_number" label="Serial" defaultValue={d.serial_number} mono />
      <Inp name="imei" label="IMEI" defaultValue={d.imei} mono />
      <Inp name="box_tag" label="Box tag" defaultValue={d.box_tag} mono />
      <Inp name="technician" label="Technician" defaultValue={d.technician} />

      <div className="text-xs text-muted">Redactions</div>
      <div className="flex flex-wrap gap-2">
        {REDACTIONS.map(([c, label]) => (
          <label key={c} className="inline-flex items-center gap-2 rounded-full border hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            <input type="checkbox" name={`r_${c}`} defaultChecked={d.redactions?.includes(c)} className="h-3 w-3 accent-ink" />
            {label}
          </label>
        ))}
      </div>

      <label className="block text-xs text-muted">
        Notes
        <textarea name="notes" rows={3} defaultValue={d.notes || ""} className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline" />
      </label>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={busy} className="btn-accent text-sm">{busy ? "Saving…" : "Save"}</button>
        <button type="button" onClick={() => setEditing(false)} className="btn-ghost text-sm">Cancel</button>
        {err ? <span className="text-xs text-red-600">{err}</span> : null}
      </div>
    </form>
  );
}

function Inp({ name, label, defaultValue, mono }) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <input
        name={name}
        defaultValue={defaultValue || ""}
        className={`mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
