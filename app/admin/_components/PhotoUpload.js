"use client";

import { useState } from "react";
import { api } from "./api";

// iPhone-friendly photo upload. `capture="environment"` triggers the rear
// camera on iOS/Android browsers; otherwise it falls back to the file picker.
export default function PhotoUpload({ tag, onUploaded }) {
  const [phase, setPhase] = useState("INTAKE");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function handleFiles(fileList) {
    if (!fileList || !fileList.length) return;
    setBusy(true); setErr(null);
    try {
      for (const file of fileList) {
        const form = new FormData();
        form.append("file", file);
        form.append("phase", phase);
        if (caption) form.append("caption", caption);
        await api.upload(`/api/devices/${encodeURIComponent(tag)}/photos`, form);
      }
      setCaption("");
      if (onUploaded) onUploaded();
    } catch (e) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="surface p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Capture photo</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <label className="text-xs text-muted">
          Phase
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
          >
            <option value="INTAKE">Intake</option>
            <option value="BEFORE">Before</option>
            <option value="AFTER">After</option>
            <option value="SHIPPING">Shipping</option>
          </select>
        </label>
        <label className="text-xs text-muted">
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. front camera removed, board cleaned"
            className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm hairline"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className={`btn-accent cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}>
          {busy ? "Uploading…" : "Take photo"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        <label className={`btn-ghost cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}>
          From library
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {err ? <div className="mt-3 text-xs text-red-600">{err}</div> : null}
    </div>
  );
}
