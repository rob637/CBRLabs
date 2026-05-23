"use client";

// Visual state pill. Colors map roughly to lifecycle stage.
const COLOR = {
  RECEIVED:    "bg-slate-100  text-slate-700  border-slate-200",
  INTAKE:      "bg-slate-100  text-slate-700  border-slate-200",
  IN_QUEUE:    "bg-blue-50    text-blue-700   border-blue-200",
  ON_BENCH:    "bg-amber-50   text-amber-800  border-amber-200",
  REDACTED:    "bg-amber-50   text-amber-800  border-amber-200",
  VERIFIED:    "bg-emerald-50 text-emerald-800 border-emerald-200",
  CERT_ISSUED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  PACKED:      "bg-indigo-50  text-indigo-800 border-indigo-200",
  SHIPPED:     "bg-indigo-50  text-indigo-800 border-indigo-200",
  DELIVERED:   "bg-emerald-100 text-emerald-900 border-emerald-300",
  HOLD:        "bg-red-50     text-red-700    border-red-200",
  RETURNED:    "bg-zinc-100   text-zinc-700   border-zinc-200",
};

export default function StateChip({ state }) {
  const klass = COLOR[state] || "bg-zinc-100 text-zinc-700 border-zinc-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${klass}`}>
      {state || "—"}
    </span>
  );
}
