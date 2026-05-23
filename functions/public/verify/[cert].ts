// /public/verify/:cert — public certificate verification endpoint.
// NOT protected by Cloudflare Access. Returns minimal, non-sensitive info.
import { Env, json, handle, HttpError } from "../../api/_utils";

export const onRequestGet: PagesFunction<Env, "cert"> = ({ env, params }) => handle(async () => {
  const ref = String(params.cert || "").trim();
  if (!ref) throw new HttpError(400, "cert reference required");

  const row = await env.DB
    .prepare(
      `SELECT d.tag, d.cert_number, d.state, d.model, d.redactions,
              d.shipped_at,
              (SELECT MAX(occurred_at) FROM device_events
                 WHERE device_id = d.id AND event_type = 'STATE_CHANGE'
                   AND to_state = 'CERT_ISSUED') AS cert_issued_at,
              (SELECT actor FROM device_events
                 WHERE device_id = d.id AND event_type = 'STATE_CHANGE'
                   AND to_state = 'CERT_ISSUED'
                 ORDER BY occurred_at DESC LIMIT 1) AS issuer
       FROM devices d
       WHERE d.cert_number = ?1 OR d.tag = ?1
       LIMIT 1`
    )
    .bind(ref)
    .first<{
      tag: string;
      cert_number: string | null;
      state: string;
      model: string | null;
      redactions: string | null;
      shipped_at: string | null;
      cert_issued_at: string | null;
      issuer: string | null;
    }>();

  if (!row) {
    return json({
      ok: false,
      verified: false,
      message: "No certificate matches that reference.",
    }, 404);
  }

  const eligible = new Set(["CERT_ISSUED", "PACKED", "SHIPPED", "DELIVERED", "RETURNED"]);
  const verified = eligible.has(row.state);

  let redactions: string[] = [];
  if (row.redactions) {
    try { redactions = JSON.parse(row.redactions); } catch { /* ignore */ }
  }

  return json({
    ok: true,
    verified,
    cert_number: row.cert_number,
    tag: row.tag,
    model: row.model,
    redactions,
    state: row.state,
    issued_at: row.cert_issued_at,
    shipped_at: row.shipped_at,
    issuer: row.issuer,
    issuer_org: "CBR Labs LLC",
  });
});
