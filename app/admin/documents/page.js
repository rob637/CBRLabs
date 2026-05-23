"use client";

import { useEffect, useState } from "react";
import { api, formatDate } from "../_components/api";
import PageHeader from "../_components/PageHeader";

const KINDS = ["COI","CAGE","W-9","NDA","SOP","PROPOSAL","CONTRACT","INSURANCE","LICENSE","OTHER"];

function expiryColor(expires_at) {
  if (!expires_at) return "text-muted";
  const days = (new Date(expires_at) - new Date()) / 86400000;
  if (days < 0) return "text-red-700 font-semibold";
  if (days < 30) return "text-amber-600 font-semibold";
  return "text-ink";
}

export default function DocumentsPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    const q = filter ? `?kind=${encodeURIComponent(filter)}` : "";
    return api.get(`/api/documents${q}`).then((d) => setList(d.documents || []))
      .catch((e) => setErr(e.message));
  };
  useEffect(() => { load(); }, [filter]);

  async function del(id) {
    if (!confirm("Delete this document?")) return;
    await api.patch(`/api/documents/${id}`, { _method: "DELETE" }).catch(() => {});
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Document vault"
        sub="Compliance, contracts, and certifications. Track expirations."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ Upload"}
          </button>
        }
      />

      {showForm ? <UploadForm onSaved={() => { setShowForm(false); load(); }} /> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")}
          className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${!filter ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
        >All</button>
        {KINDS.map((k) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-full border hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${filter === k ? "bg-ink text-paper" : "text-muted hover:bg-ink/5"}`}
          >{k}</button>
        ))}
      </div>

      {err ? <div className="mt-4 surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="mt-6 surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No documents.</td></tr>
            ) : list.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3">
                  <a href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer" className="hover:text-accent">{d.name}</a>
                  {d.notes ? <div className="text-xs text-muted">{d.notes}</div> : null}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">{d.kind}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{formatDate(d.created_at)}</td>
                <td className={`px-4 py-3 font-mono text-xs ${expiryColor(d.expires_at)}`}>{d.expires_at || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del(d.id)} className="text-xs text-muted hover:text-red-700">delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UploadForm({ onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("OTHER");
  const [expires, setExpires] = useState("");
  const [notes, setNotes] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!file) { setErr("Choose a file."); return; }
    setBusy(true); setErr(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", name || file.name);
      form.append("kind", kind);
      if (expires) form.append("expires_at", expires);
      if (notes) form.append("notes", notes);
      await api.upload("/api/documents", form);
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-6 surface p-5 grid gap-3 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">
        <span className="eyebrow">File *</span>
        <input required type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Display name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={file?.name || "—"}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Kind</span>
        <select value={kind} onChange={(e) => setKind(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2">
          {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="eyebrow">Expires</span>
        <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      <label className="text-sm">
        <span className="eyebrow">Notes</span>
        <input value={notes} onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded border hairline bg-paper px-3 py-2" />
      </label>
      {err ? <div className="sm:col-span-2 text-sm text-red-700">{err}</div> : null}
      <div className="sm:col-span-2">
        <button disabled={busy} className="btn-accent">{busy ? "Uploading…" : "Upload"}</button>
      </div>
    </form>
  );
}
