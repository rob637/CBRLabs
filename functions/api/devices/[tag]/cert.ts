// GET /api/devices/:tag/cert — hydrated data for client-side Cert of Redaction PDF.
import { Env, json, error } from "../../_utils";

export const onRequestGet: PagesFunction<Env, "tag"> = async ({ env, params }) => {
  const tag = String(params.tag || "");
  if (!tag) return error(400, "tag required");

  const device = await env.DB
    .prepare(
      `SELECT d.id, d.tag, d.model, d.serial_number AS serial, d.imei,
              d.redactions, d.state, d.cert_serial, d.cert_issued_at,
              d.customer_id
       FROM devices d WHERE d.tag = ?1`
    )
    .bind(tag)
    .first<Record<string, unknown> & { id: number; customer_id: number | null; redactions: string | null }>();
  if (!device) return error(404, "device not found");

  let customer = null;
  if (device.customer_id) {
    customer = await env.DB
      .prepare("SELECT id, name, contact_name, email, phone, org FROM customers WHERE id = ?1")
      .bind(device.customer_id)
      .first();
  }

  const events = await env.DB
    .prepare(
      `SELECT event_type, from_state, to_state, actor, occurred_at
       FROM device_events
       WHERE device_id = ?1 AND event_type IN ('STATE_CHANGE','UPDATE','REDACTION')
       ORDER BY occurred_at ASC, id ASC`
    )
    .bind(device.id)
    .all();

  let redactions: string[] = [];
  if (device.redactions) {
    try { redactions = JSON.parse(device.redactions as string); } catch { /* ignore */ }
  }

  return json({
    device: { ...device, redactions },
    customer,
    redactions,
    events: events.results,
  });
};
