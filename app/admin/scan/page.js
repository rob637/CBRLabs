"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../_components/PageHeader";

const RECENT_KEY = "cbr.scan.recent";

export default function ScanPage() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw).slice(0, 8));
    } catch { /* ignore */ }
  }, []);

  function pushRecent(t) {
    try {
      const next = [t, ...recent.filter((x) => x !== t)].slice(0, 8);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  }

  function go(e) {
    e?.preventDefault();
    const t = tag.trim().toUpperCase();
    if (!t) return;
    pushRecent(t);
    router.push(`/admin/devices/view?tag=${encodeURIComponent(t)}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Scan"
        sub="Single-thumb use at the bench. Tap a tag to jump."
      />

      <section className="surface p-4 sm:p-6">
        <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            autoFocus
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="CBR-2026-0142"
            className="flex-1 rounded-xl border bg-paper px-4 py-4 font-mono text-lg uppercase tracking-wider hairline"
          />
          <button type="submit" className="btn-accent justify-center px-6 py-4 text-base">
            Open →
          </button>
        </form>

        <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto pb-1">
          {["ON_BENCH", "IN_QUEUE", "REDACTED", "VERIFIED", "CERT_ISSUED", "PACKED"].map((s) => (
            <button
              key={s}
              onClick={() => router.push(`/admin/devices?state=${s}`)}
              className="shrink-0 rounded-full border hairline px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:bg-ink/5"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {recent.length ? (
        <section className="surface mt-4 overflow-hidden">
          <div className="border-b hairline px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Recent on this device
          </div>
          <ul className="divide-y hairline">
            {recent.map((t) => (
              <li key={t}>
                <button
                  onClick={() => { pushRecent(t); router.push(`/admin/devices/view?tag=${encodeURIComponent(t)}`); }}
                  className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-ink/[0.02]"
                >
                  <span className="font-mono text-base">{t}</span>
                  <span className="text-muted">→</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t hairline px-4 py-2 text-right">
            <button
              onClick={() => { setRecent([]); localStorage.removeItem(RECENT_KEY); }}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              Clear
            </button>
          </div>
        </section>
      ) : null}

      <details className="mt-4 surface p-4 sm:p-5">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          How camera scanning works
        </summary>
        <ol className="mt-4 space-y-3 text-sm">
          <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">01</span> Open the built-in <strong>Camera</strong> app on iPhone / iPad.</li>
          <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">02</span> Point at the QR sticker on the device or box.</li>
          <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">03</span> Tap the yellow banner that appears.</li>
          <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">04</span> Sign in through Cloudflare Access if prompted.</li>
          <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">05</span> The device record loads. Photograph, advance state, done.</li>
        </ol>
        <p className="mt-4 text-xs text-muted">
          Add this admin site to your iPhone Home Screen (Share → Add to Home
          Screen) for a full-screen, single-tap experience that remembers your
          Access session.
        </p>
      </details>
    </div>
  );
}
