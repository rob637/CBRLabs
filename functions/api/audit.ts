// GET /api/audit  — query device_events (chain of custody).
// Filters: device_tag, actor, event_type, from, to, limit, offset, format=csv
//
// CSV export is a sales/compliance tool: ship the full event log to a federal
// buyer as proof of custody.
import { Env, json, handle, requireActor, paginate } from "./_utils";

interface EventRow {
  id: number;
  device_id: number;
  device_tag: string | null;
  event_type: string;
  from_state: string | null;
  to_state: string | null;
  actor: string;
  payload: string | null;
  occurred_at: string;
  customer_name: string | null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const deviceTag = url.searchParams.get("device_tag");
  const actor = url.searchParams.get("actor");
  const eventType = url.searchParams.get("event_type");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = url.searchParams.get("format");

  const isCsv = format === "csv";
  const { limit, offset } = paginate(url, isCsv ? 10000 : 200, isCsv ? 50000 : 1000);

  const where: string[] = [];
  const binds: unknown[] = [];
  if (deviceTag) { where.push(`d.tag = ?${binds.length + 1}`);        binds.push(deviceTag); }
  if (actor)     { where.push(`e.actor = ?${binds.length + 1}`);      binds.push(actor); }
  if (eventType) { where.push(`e.event_type = ?${binds.length + 1}`); binds.push(eventType); }
  if (from)      { where.push(`e.occurred_at >= ?${binds.length + 1}`); binds.push(from); }
  if (to)        { where.push(`e.occurred_at <= ?${binds.length + 1}`); binds.push(to); }
  binds.push(limit, offset);

  const sql = `
    SELECT e.id, e.device_id, d.tag AS device_tag,
           e.event_type, e.from_state, e.to_state,
           e.actor, e.payload, e.occurred_at,
           c.name AS customer_name
    FROM device_events e
    LEFT JOIN devices   d ON d.id = e.device_id
    LEFT JOIN customers c ON c.id = d.customer_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY e.occurred_at DESC, e.id DESC
    LIMIT ?${binds.length - 1} OFFSET ?${binds.length}`;
  const rs = await env.DB.prepare(sql).bind(...binds).all<EventRow>();
  const rows = rs.results || [];

  if (isCsv) {
    const header = ["occurred_at", "device_tag", "customer", "event_type", "from_state", "to_state", "actor", "payload"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        r.occurred_at,
        r.device_tag || "",
        r.customer_name || "",
        r.event_type,
        r.from_state || "",
        r.to_state || "",
        r.actor,
        r.payload || "",
      ].map(csvCell).join(","));
    }
    const body = lines.join("\n") + "\n";
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(body, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="cbr-audit-${stamp}.csv"`,
        "cache-control": "no-store",
      },
    });
  }

  return json({ events: rows, limit, offset });
});

function csvCell(v: string): string {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
