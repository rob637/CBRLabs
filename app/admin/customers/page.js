"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDate } from "../_components/api";
import PageHeader from "../_components/PageHeader";

export default function CustomersPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    api.get("/api/customers").then((d) => setList(d.customers || [])).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Customers"
        sub="Organizations we work with. Each has POs and devices."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? "Close" : "+ New customer"}
          </button>
        }
      />

      {showForm ? (
        <CustomerForm
          onSaved={() => { setShowForm(false); load(); }}
        />
      ) : null}

      {err ? <div className="mt-4 surface p-4 text-sm text-red-700">{err}</div> : null}

      <div className="mt-6 surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Org</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">POs</th>
              <th className="px-4 py-3">Devices</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {list === null ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">No customers yet.</td></tr>
            ) : list.map((c) => (
              <tr key={c.id} className="hover:bg-ink/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/view?id=${c.id}`} className="text-ink hover:text-accent">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{c.org || "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {c.email ? <a href={`mailto:${c.email}`} className="hover:text-accent">{c.email}</a> : "—"}
                  {c.phone ? <div className="text-xs">{c.phone}</div> : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.po_count ?? 0}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.device_count ?? 0}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{formatDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerForm({ onSaved }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      await api.post("/api/customers", body);
      onSaved?.();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="surface mt-4 grid gap-4 p-5 sm:grid-cols-2">
      <Field name="name" label="Name *" required />
      <Field name="org" label="Organization" />
      <Field name="email" label="Email" type="email" />
      <Field name="phone" label="Phone" type="tel" />
      <Field name="billing_address" label="Billing address" className="sm:col-span-2" textarea />
      <Field name="notes" label="Notes" className="sm:col-span-2" textarea />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-accent">
          {busy ? "Saving…" : "Save customer"}
        </button>
        {err ? <span className="text-sm text-red-600">{err}</span> : null}
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", required, textarea, className = "" }) {
  return (
    <label className={`text-xs text-muted ${className}`}>
      {label}
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm text-ink hairline"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-1 w-full rounded-lg border bg-paper px-3 py-2 text-sm text-ink hairline"
        />
      )}
    </label>
  );
}
