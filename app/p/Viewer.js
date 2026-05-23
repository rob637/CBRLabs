"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function money(cents) {
  return `$${((cents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProposalViewer() {
  const sp = useSearchParams();
  const token = sp.get("t");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [decided, setDecided] = useState(null);
  const [signer, setSigner] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/public/proposals/${token}`)
      .then((r) => r.ok ? r.json() : r.json().then((j) => { throw new Error(j.error || "Not found"); }))
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [token]);

  async function respond(decision) {
    setBusy(true);
    try {
      const r = await fetch(`/public/proposals/${token}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, signer_name: signer, note }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setDecided(decision);
    } catch (e) {
      setErr(e.message);
    } finally { setBusy(false); }
  }

  if (!token) return <Wrap><p className="text-sm text-muted">No proposal token in URL.</p></Wrap>;
  if (err)    return <Wrap><p className="text-sm text-red-700">{err}</p></Wrap>;
  if (!data)  return <Wrap><p className="text-sm text-muted">Loading…</p></Wrap>;

  const p = data.proposal;
  const isFinal = decided || ["ACCEPTED","REJECTED"].includes(p.status);

  return (
    <Wrap>
      <header className="border-b hairline pb-6 mb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">CBR LABS · PROPOSAL</div>
        <h1 className="mt-2 font-display text-4xl tracking-tightest">{p.title}</h1>
        <div className="mt-2 font-mono text-xs text-muted">{p.proposal_number} · for {p.customer_name}</div>
      </header>

      {p.scope_summary ? (
        <section className="mb-8">
          <div className="eyebrow mb-2">Scope</div>
          <p className="text-sm whitespace-pre-wrap">{p.scope_summary}</p>
        </section>
      ) : null}

      <section className="mb-8">
        <div className="eyebrow mb-2">Line items</div>
        <table className="w-full text-sm">
          <thead className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted border-b hairline">
            <tr><th className="py-2">Description</th><th className="text-right">Qty</th><th className="text-right">Unit</th><th className="text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y hairline">
            {data.lines.map((l) => (
              <tr key={l.id}>
                <td className="py-2">{l.description}</td>
                <td className="py-2 text-right font-mono">{l.quantity}</td>
                <td className="py-2 text-right font-mono">{money(l.unit_price_cents)}</td>
                <td className="py-2 text-right font-mono">{money(l.amount_cents)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t hairline">
              <td colSpan={3} className="py-3 text-right font-mono text-xs uppercase tracking-[0.14em] text-muted">Total</td>
              <td className="py-3 text-right font-display text-xl">{money(p.total_cents)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {p.terms ? (
        <section className="mb-8">
          <div className="eyebrow mb-2">Terms</div>
          <p className="text-sm whitespace-pre-wrap">{p.terms}</p>
        </section>
      ) : null}

      <section className="surface p-6 mt-10">
        {isFinal ? (
          <div className="text-center">
            <div className="font-display text-2xl tracking-tightest">
              {(decided || p.status) === "ACCEPTED" ? "Thank you — proposal accepted." : "Proposal declined."}
            </div>
            <p className="mt-2 text-sm text-muted">CBR Labs will follow up shortly at the contact on file.</p>
          </div>
        ) : (
          <>
            <div className="eyebrow mb-3">Respond</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="eyebrow">Your name (for signature)</span>
                <input value={signer} onChange={(e) => setSigner(e.target.value)}
                  className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
              </label>
              <label className="text-sm">
                <span className="eyebrow">Optional note</span>
                <input value={note} onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button disabled={busy || !signer.trim()} onClick={() => respond("ACCEPT")} className="btn-accent">
                {busy ? "Submitting…" : "Accept proposal"}
              </button>
              <button disabled={busy} onClick={() => respond("REJECT")} className="btn-ghost">
                Decline
              </button>
            </div>
            {!signer.trim() ? <p className="mt-2 text-xs text-muted">Type your name to enable Accept.</p> : null}
          </>
        )}
      </section>

      <footer className="mt-12 border-t hairline pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted text-center">
        CBR Labs LLC · CAGE 14Y35 · UEI K4MZG4KC1MY9 · cbr-labs.com
      </footer>
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-12">{children}</div>
    </div>
  );
}
