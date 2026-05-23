"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={null}>
      <VerifyPage />
    </Suspense>
  );
}

function VerifyPage() {
  const sp = useSearchParams();
  const ref = (sp.get("cert") || sp.get("tag") || "").trim();
  const [state, setState] = useState({ loading: true, data: null, err: null });

  useEffect(() => {
    if (!ref) {
      setState({ loading: false, data: null, err: null });
      return;
    }
    fetch(`/public/verify/${encodeURIComponent(ref)}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => setState({ loading: false, data: j, err: ok ? null : (j?.error || "Not found") }))
      .catch((e) => setState({ loading: false, data: null, err: e.message }));
  }, [ref]);

  return (
    <section className="container-xl pt-20 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Certificate verification</div>
        <h1 className="mt-6 font-display text-4xl font-medium tracking-tightest sm:text-6xl">
          Verify a <span className="text-accent">Certificate of Redaction</span>.
        </h1>
        <p className="mt-6 text-muted">
          Every CBR Labs certificate carries a QR code that resolves to this page.
          Scan or enter a certificate number or device tag to confirm authenticity.
        </p>

        <Lookup initial={ref} />

        <div className="mt-10">
          {!ref ? (
            <p className="text-sm text-muted">Enter a reference above to verify.</p>
          ) : state.loading ? (
            <div className="surface p-6 text-sm text-muted">Looking up <span className="font-mono">{ref}</span>…</div>
          ) : !state.data || state.data.verified === false ? (
            <ResultCard
              tone="warn"
              title="Could not verify"
              body={
                state.data?.message ||
                state.err ||
                "This reference does not match an issued certificate. Verify the number and try again, or contact CBR Labs."
              }
              ref={ref}
            />
          ) : (
            <VerifiedCard d={state.data} />
          )}
        </div>

        <div className="mt-12 surface p-6">
          <div className="eyebrow">About this check</div>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            This page queries the CBR Labs production record system and reports
            the current status of the referenced device. A "verified" result
            confirms the certificate was issued by CBR Labs and identifies the
            redactions performed. For full chain-of-custody documentation or the
            signed PDF, contact the issuing CBR Labs technician or
            <Link href="/contact" className="text-accent hover:underline"> request a copy</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Lookup({ initial }) {
  const [v, setV] = useState(initial || "");
  return (
    <form
      action="/v"
      method="get"
      className="mt-8 flex gap-2"
    >
      <input
        name="cert"
        defaultValue={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Certificate number or device tag"
        className="flex-1 rounded-lg border bg-paper px-4 py-3 font-mono text-sm hairline"
      />
      <button type="submit" className="btn-accent">Verify</button>
    </form>
  );
}

function VerifiedCard({ d }) {
  return (
    <div className="surface p-7 sm:p-9 border-2 border-accent/40">
      <div className="flex items-start gap-4">
        <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Verified</div>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
            Issued by {d.issuer_org}
          </h2>
        </div>
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-sm">
        <Row label="Certificate #" value={d.cert_number || "—"} mono />
        <Row label="Device tag" value={d.tag} mono />
        <Row label="Model" value={d.model || "—"} />
        <Row label="Current state" value={d.state} mono />
        <Row label="Cert issued" value={fmt(d.issued_at)} />
        <Row label="Shipped" value={fmt(d.shipped_at)} />
        <Row label="Issuing technician" value={d.issuer || "—"} />
      </dl>

      {Array.isArray(d.redactions) && d.redactions.length ? (
        <>
          <div className="rule my-6" />
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Redactions performed</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {d.redactions.map((r) => (
              <span key={r} className="chip">{r}</span>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ResultCard({ tone, title, body, ref }) {
  const accent = tone === "warn" ? "text-amber-600 border-amber-600/30" : "text-accent border-accent/40";
  return (
    <div className={`surface p-7 border ${accent}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{title}</div>
      <p className="mt-3 text-ink/90">{body}</p>
      {ref ? <p className="mt-4 font-mono text-xs text-muted">Reference checked: {ref}</p> : null}
    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className={`mt-1 ${mono ? "font-mono" : ""} text-ink`}>{value || "—"}</dd>
    </div>
  );
}

function fmt(s) {
  if (!s) return "—";
  return String(s).replace("T", " ").slice(0, 16);
}
