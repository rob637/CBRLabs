"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../_components/PageHeader";

export default function ScanPage() {
  const router = useRouter();
  const [tag, setTag] = useState("");

  function go(e) {
    e?.preventDefault();
    const t = tag.trim().toUpperCase();
    if (!t) return;
    router.push(`/admin/devices/view?tag=${encodeURIComponent(t)}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Scan"
        sub="Aim your iPhone camera at any CBR sticker — iOS opens the device record automatically."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">iPhone / iPad</div>
          <ol className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">01</span> Open the built-in <strong>Camera</strong> app.</li>
            <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">02</span> Point at the QR sticker on the device or box.</li>
            <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">03</span> Tap the yellow banner that appears at the top.</li>
            <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">04</span> Sign in through Cloudflare Access (one tap with a saved magic link).</li>
            <li className="flex gap-3"><span className="font-mono text-[10px] text-muted">05</span> The device record loads. Photograph, advance state, done.</li>
          </ol>
          <p className="mt-5 text-xs text-muted">
            For fastest field use, add this admin site to your iPhone Home Screen
            (Share → Add to Home Screen). It opens full-screen and remembers your Access session.
          </p>
        </section>

        <section className="surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Manual lookup</div>
          <p className="mt-3 text-sm text-muted">
            Type or paste a tag if a sticker won&apos;t scan.
          </p>
          <form onSubmit={go} className="mt-4 flex gap-2">
            <input
              autoFocus
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="CBR-2026-0142"
              className="flex-1 rounded-lg border bg-paper px-3 py-2 font-mono text-sm hairline"
            />
            <button type="submit" className="btn-accent">Open →</button>
          </form>
          <div className="rule my-5" />
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Browser camera</div>
          <p className="mt-2 text-xs text-muted">
            Not using an iPhone? Most modern desktop browsers can&apos;t scan QR
            without an extension — open the URL directly from the sticker label
            sheet preview, or use a phone camera.
          </p>
        </section>
      </div>
    </div>
  );
}
