"use client";

// Lightweight fetch wrapper for /api/* — throws on non-2xx with parsed error.
async function request(method, path, { body, headers, raw } = {}) {
  const init = { method, headers: { ...(headers || {}) } };
  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      init.headers["content-type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }
  const res = await fetch(path, init);
  if (raw) return res;
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get:   (p)         => request("GET",    p),
  post:  (p, body)   => request("POST",   p, { body }),
  patch: (p, body)   => request("PATCH",  p, { body }),
  upload:(p, form)   => request("POST",   p, { body: form }),
};

export const STATES = [
  "RECEIVED","INTAKE","IN_QUEUE","ON_BENCH","REDACTED",
  "VERIFIED","CERT_ISSUED","PACKED","SHIPPED","DELIVERED",
  "HOLD","RETURNED",
];

export const REDACTIONS = [
  ["CAMERA",   "Cameras"],
  ["MIC",      "Microphones"],
  ["SPEAKER",  "Speakers"],
  ["WIFI",     "Wi-Fi"],
  ["BT",       "Bluetooth"],
  ["CELL",     "Cellular"],
  ["GPS",      "GPS"],
  ["NFC",      "NFC"],
  ["ANTENNA",  "Antennas"],
];

export function formatMoney(cents) {
  if (cents == null) return "—";
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d.replace(" ", "T") + (d.endsWith("Z") ? "" : "Z")).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
}
