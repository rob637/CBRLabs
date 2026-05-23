"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";
import QRCanvas from "../_components/QRCanvas";
import { LAYOUTS, buildStickerPDF, downloadBlob } from "../_components/StickerPDF";

export default function LabelsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <LabelsPage />
    </Suspense>
  );
}

function LabelsPage() {
  const sp = useSearchParams();
  const preTags = sp.get("tags") || "";

  const [tags, setTags] = useState(preTags);
  const [layout, setLayout] = useState("AVERY_22805");
  const [copies, setCopies] = useState(1);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const tagList = useMemo(
    () => tags.split(/[\s,]+/).map((t) => t.trim().toUpperCase()).filter(Boolean),
    [tags]
  );

  useEffect(() => {
    if (!tagList.length) { setDevices([]); return; }
    setLoading(true); setErr(null);
    Promise.all(tagList.map((t) =>
      api.get(`/api/devices/${encodeURIComponent(t)}`).then((d) => d.device).catch(() => null)
    ))
      .then((rows) => setDevices(rows.filter(Boolean)))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [tags]); // eslint-disable-line react-hooks/exhaustive-deps

  async function generate() {
    if (!devices.length) return;
    setBusy(true); setErr(null);
    try {
      const origin = window.location.origin;
      const stickers = [];
      for (const d of devices) {
        const url = `${origin}/admin/devices/view?tag=${d.tag}`;
        const lines = layout === "AVERY_5163"
          ? [
              d.tag,
              `Customer: ${d.customer_name || "—"}`,
              `PO: ${d.po_number || "—"}`,
              `Model: ${d.model || "—"}`,
              `Serial: ${d.serial_number || "—"}`,
              `Box: ${d.box_tag || "—"}`,
            ]
          : [d.tag, "CBR LABS"];
        for (let i = 0; i < copies; i++) stickers.push({ url, lines });
      }
      const blob = await buildStickerPDF({ layout, stickers });
      const fname = `cbr-labels-${layout.toLowerCase()}-${new Date().toISOString().slice(0,10)}.pdf`;
      downloadBlob(blob, fname);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  const totalLabels = devices.length * copies;
  const perSheet = LAYOUTS[layout].cols * LAYOUTS[layout].rows;
  const sheets = Math.ceil(totalLabels / perSheet) || 0;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Sticker sheets"
        sub="Generate Avery PDF label sheets with QR codes for any set of devices."
        actions={
          <Link href="/admin/devices" className="btn-ghost">Choose from list →</Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="surface p-5 space-y-4">
          <label className="block text-xs text-muted">
            Tags (comma- or newline-separated)
            <textarea
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              rows={4}
              placeholder="CBR-2026-0142, CBR-2026-0143"
              className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 font-mono text-sm hairline"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-muted">
              Layout
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
              >
                {Object.entries(LAYOUTS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-muted">
              Copies per device
              <input
                type="number"
                min="1"
                max="24"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
              />
            </label>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Preview ({devices.length} device{devices.length === 1 ? "" : "s"} · {totalLabels} label{totalLabels === 1 ? "" : "s"} · {sheets} sheet{sheets === 1 ? "" : "s"})
          </div>
          {loading ? (
            <div className="text-sm text-muted">Resolving tags…</div>
          ) : devices.length === 0 ? (
            <div className="text-sm text-muted">Add tags above to preview.</div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {devices.map((d) => (
                <div key={d.id} className="rounded-lg border hairline p-2 text-center">
                  <QRCanvas
                    text={typeof window !== "undefined" ? `${window.location.origin}/admin/devices/view?tag=${d.tag}` : ""}
                    size={96}
                  />
                  <div className="mt-1 font-mono text-[10px] break-all">{d.tag}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={generate} disabled={busy || !devices.length} className="btn-accent">
              {busy ? "Generating…" : "Download PDF"}
            </button>
            {err ? <span className="text-sm text-red-600">{err}</span> : null}
          </div>
        </section>

        <aside className="surface p-5 text-xs text-muted space-y-3">
          <div className="font-mono uppercase tracking-[0.16em] text-ink/80">Print tips</div>
          <p>Use <strong>actual size</strong> / <strong>100%</strong> scaling — never &quot;fit to page&quot;. Set margins to <em>None</em>.</p>
          <p>Test on plain paper first; hold up to a sticker sheet to verify alignment before printing on label stock.</p>
          <p>Recommended: laser printer for smear-free QR scanning. Inkjet works but let labels dry 60s.</p>
          <div className="rule" />
          <div className="font-mono uppercase tracking-[0.16em] text-ink/80">Encoded URL</div>
          <p>Each QR encodes a link directly to the device record (behind Cloudflare Access). iPhone Camera app decodes natively.</p>
        </aside>
      </div>
    </div>
  );
}
