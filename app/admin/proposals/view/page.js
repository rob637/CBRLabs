"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatMoney } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";
import { buildProposalPDF, downloadDoc } from "../../_components/BrandedPDF";

export default function ProposalViewWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <ProposalView />
    </Suspense>
  );
}

function ProposalView() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  const load = () => api.get(`/api/proposals/${id}`).then((d) => {
    setData(d);
    if (d.share_token) setShareUrl(`${window.location.origin}/p?t=${d.share_token}`);
  }).catch((e) => setErr(e.message));
  useEffect(() => { if (id) load(); }, [id]);

  async function markSent() {
    await api.patch(`/api/proposals/${id}`, { mark_sent: true });
    load();
  }
  async function mintLink() {
    const r = await api.patch(`/api/proposals/${id}`, { mint_share_token: true });
    setShareUrl(`${window.location.origin}/p?t=${r.token}`);
  }
  async function downloadPDF() {
    const doc = buildProposalPDF({
      proposal: data.proposal,
      customer: data.customer,
      lines: data.lines,
      shareUrl: shareUrl || null,
    });
    downloadDoc(doc, `${data.proposal.proposal_number || `proposal-${data.proposal.id}`}.pdf`);
  }

  if (err) return <div className="surface p-4 text-sm text-red-700">{err}</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;
  const p = data.proposal;

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Proposal"
        title={p.proposal_number}
        sub={`${data.customer?.name || ""} · ${p.status}`}
        actions={
          <div className="flex gap-2 flex-wrap">
            <button onClick={downloadPDF} className="btn-accent">Download PDF</button>
            {p.status === "DRAFT" ? <button onClick={markSent} className="btn-ghost">Mark sent</button> : null}
            <button onClick={mintLink} className="btn-ghost">Get share link</button>
          </div>
        }
      />

      {shareUrl ? (
        <div className="mt-4 surface p-4">
          <div className="eyebrow mb-2">Customer accept URL</div>
          <code className="block break-all rounded bg-ink/5 px-3 py-2 text-xs font-mono">{shareUrl}</code>
          <button onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="mt-2 text-xs text-accent hover:underline">Copy</button>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total" value={formatMoney(p.total_cents)} accent />
        <Stat label="Valid until" value={p.valid_until || "—"} />
        <Stat label="Viewed at" value={p.viewed_at?.slice(0,16).replace("T"," ") || "—"} />
      </div>

      <LineEditor proposalId={id} lines={data.lines} onSaved={load} />

      <Meta proposalId={id} proposal={p} onSaved={load} />
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

function LineEditor({ proposalId, lines: initial, onSaved }) {
  const [lines, setLines] = useState(initial || []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => { setLines(initial || []); }, [initial]);

  function update(i, patch) { setLines((ls) => ls.map((l, idx) => idx === i ? { ...l, ...patch } : l)); }
  function add() { setLines((ls) => [...ls, { description: "", quantity: 1, unit_price_cents: 0 }]); }
  function remove(i) { setLines((ls) => ls.filter((_, idx) => idx !== i)); }

  async function save() {
    setBusy(true); setErr(null);
    try {
      await api.patch(`/api/proposals/${proposalId}`, {
        lines: lines.map((l, i) => ({
          position: i, description: l.description,
          quantity: Number(l.quantity) || 1,
          unit_price_cents: Number(l.unit_price_cents) || 0,
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
          const amt = (Number(l.quantity) || 0) * (Number(l.unit_price_cents) || 0);
          return (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr,80px,140px,120px,40px] items-center">
              <input value={l.description || ""} onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Description"
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm" />
              <input type="number" value={l.quantity ?? 1} onChange={(e) => update(i, { quantity: e.target.value })}
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm font-mono text-right" />
              <input type="number" value={l.unit_price_cents ?? 0} onChange={(e) => update(i, { unit_price_cents: e.target.value })}
                placeholder="cents"
                className="rounded border hairline bg-paper px-2 py-1.5 text-sm font-mono text-right" />
              <div className="font-mono text-xs text-right">{formatMoney(amt)}</div>
              <button onClick={() => remove(i)} className="text-muted hover:text-red-700">×</button>
            </div>
          );
        })}
      </div>
      {err ? <div className="mt-3 text-sm text-red-700">{err}</div> : null}
      <div className="mt-4 flex justify-end">
        <button disabled={busy} onClick={save} className="btn-accent">{busy ? "Saving…" : "Save lines"}</button>
      </div>
    </div>
  );
}

function Meta({ proposalId, proposal, onSaved }) {
  const [title, setTitle] = useState(proposal.title || "");
  const [scope, setScope] = useState(proposal.scope_summary || "");
  const [terms, setTerms] = useState(proposal.terms || "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api.patch(`/api/proposals/${proposalId}`, {
        title, scope_summary: scope, terms,
      });
      onSaved();
    } finally { setBusy(false); }
  }

  return (
    <div className="mt-8 surface p-5 grid gap-3">
      <label className="text-sm">
        <span className="eyebrow">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Scope summary</span>
        <textarea value={scope} onChange={(e) => setScope(e.target.value)} rows={4}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Terms</span>
        <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <div className="flex justify-end">
        <button disabled={busy} onClick={save} className="btn-accent">{busy ? "Saving…" : "Save"}</button>
      </div>
    </div>
  );
}
