"use client";

import { useEffect, useState } from "react";
import { api, formatDate } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const STATUSES = ["NEW","CONTACTED","QUALIFIED","PROPOSAL_SENT","WON","LOST","SPAM"];

export default function LeadsPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("NEW");
  const [active, setActive] = useState(null);

  const load = () => {
    const q = filter ? `?status=${encodeURIComponent(filter)}` : "";
    return api.get(`/api/leads${q}`).then((d) => setList(d.leads || [])).catch((e) => setErr(e.message));
  };
  useEffect(() => { load(); }, [filter]);

  async function setStatus(id, status) {
    await api.patch("/api/leads", { ids: [id], status });
    setActive(null);
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Leads"
        sub="Inbound from /contact and other channels."
      />

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Org</th>
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {list === null ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No leads.</td></tr>
              ) : list.map((l) => (
                <tr key={l.id} onClick={() => setActive(l)} className="cursor-pointer hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 font-mono text-[11px] text-muted">{formatDate(l.created_at)}</td>
                  <td className="px-4 py-3">{l.name}</td>
                  <td className="px-4 py-3 text-muted">{l.org || "—"}</td>
                  <td className="px-4 py-3 text-muted truncate max-w-[260px]">{l.use_case || "—"}</td>
                  <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {active ? (
          <aside className="surface p-5 lg:sticky lg:top-6 lg:self-start">
            <div className="eyebrow mb-2">{active.status}</div>
            <h3 className="font-display text-xl tracking-tightest">{active.name}</h3>
            {active.org ? <div className="text-sm text-muted">{active.org}</div> : null}

            <dl className="mt-4 grid grid-cols-[80px_1fr] gap-y-2 text-sm">
              {active.email ? <><dt className="text-muted">Email</dt><dd><a className="hover:text-accent" href={`mailto:${active.email}`}>{active.email}</a></dd></> : null}
              {active.phone ? <><dt className="text-muted">Phone</dt><dd><a className="hover:text-accent" href={`tel:${active.phone}`}>{active.phone}</a></dd></> : null}
              {active.device_count ? <><dt className="text-muted">Devices</dt><dd>{active.device_count}</dd></> : null}
              {active.timeline ? <><dt className="text-muted">Timeline</dt><dd>{active.timeline}</dd></> : null}
              {active.source ? <><dt className="text-muted">Source</dt><dd className="font-mono text-xs">{active.source}</dd></> : null}
            </dl>

            {active.use_case ? (
              <div className="mt-4">
                <div className="eyebrow mb-1">Use case</div>
                <p className="text-sm">{active.use_case}</p>
              </div>
            ) : null}

            {active.message ? (
              <div className="mt-4">
                <div className="eyebrow mb-1">Message</div>
                <p className="text-sm whitespace-pre-wrap">{active.message}</p>
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-2">
              {STATUSES.filter((s) => s !== active.status).map((s) => (
                <button key={s} onClick={() => setStatus(active.id, s)}
                  className="rounded border hairline px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ink/5">
                  → {s}
                </button>
              ))}
            </div>
          </aside>
        ) : (
          <aside className="surface p-5 text-sm text-muted">
            Select a lead to view details.
          </aside>
        )}
      </div>
    </div>
  );
}
