"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatDate } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const EVENT_TYPES = ["", "INTAKE", "STATE_CHANGE", "PHOTO", "NOTE", "CERT", "SHIPPED"];

export default function AuditPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [deviceTag, setDeviceTag] = useState("");
  const [actor, setActor] = useState("");
  const [eventType, setEventType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const qs = () => {
    const p = new URLSearchParams();
    if (deviceTag) p.set("device_tag", deviceTag);
    if (actor) p.set("actor", actor);
    if (eventType) p.set("event_type", eventType);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString();
  };

  function load() {
    setList(null);
    setErr(null);
    api.get(`/api/audit?${qs()}`)
      .then((d) => setList(d.events || []))
      .catch((e) => setErr(e.message));
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  function exportCsv() {
    const p = new URLSearchParams(qs());
    p.set("format", "csv");
    window.location.href = `/api/audit?${p.toString()}`;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Compliance"
        title="Chain of custody"
        sub="Every state transition, photo, and note on every device. This log is your evidence trail."
        actions={
          <button onClick={exportCsv} className="btn-ghost">Export CSV ↓</button>
        }
      />

      <div className="surface mb-4 grid gap-3 p-4 md:grid-cols-5">
        <Field label="Device tag">
          <input value={deviceTag} onChange={(e) => setDeviceTag(e.target.value)}
            placeholder="CBR-2026-0001"
            className="w-full rounded-lg border bg-paper px-3 py-2 text-sm font-mono hairline" />
        </Field>
        <Field label="Actor (email)">
          <input value={actor} onChange={(e) => setActor(e.target.value)}
            placeholder="tech@…"
            className="w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline" />
        </Field>
        <Field label="Event type">
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline">
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t || "All"}</option>)}
          </select>
        </Field>
        <Field label="From (YYYY-MM-DD)">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline" />
        </Field>
        <Field label="To (YYYY-MM-DD)">
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline" />
        </Field>
        <div className="md:col-span-5 flex gap-2">
          <button onClick={load} className="btn-accent">Apply</button>
          <button
            onClick={() => { setDeviceTag(""); setActor(""); setEventType(""); setFrom(""); setTo(""); setTimeout(load, 0); }}
            className="btn-ghost">Reset</button>
        </div>
      </div>

      {err ? <div className="surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Transition</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">No events match.</td></tr>
            ) : list.map((e) => (
              <tr key={e.id} className="hover:bg-ink/[0.02]">
                <td className="px-4 py-2 font-mono text-[11px] text-muted whitespace-nowrap">{formatDate(e.occurred_at)}</td>
                <td className="px-4 py-2 font-mono text-xs">
                  {e.device_tag ? (
                    <Link href={`/admin/devices/view?tag=${e.device_tag}`} className="text-ink hover:text-accent">{e.device_tag}</Link>
                  ) : <span className="text-muted">—</span>}
                </td>
                <td className="px-4 py-2 text-xs text-muted">{e.customer_name || "—"}</td>
                <td className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em]">{e.event_type}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-muted">
                  {e.from_state || e.to_state ? `${e.from_state || "—"} → ${e.to_state || "—"}` : "—"}
                </td>
                <td className="px-4 py-2 text-xs text-muted">{e.actor}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-muted truncate max-w-[280px]">{e.payload || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}
