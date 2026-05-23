// GET   /api/devices/:tag     — full record with events + photos + customer + po
// PATCH /api/devices/:tag     — update fields (model, serial, technician, notes, redactions)
import { Env, json, error, handle, requireActor } from "../_utils";
import { logEvent, parseJson } from "../_db";

export const onRequestGet: PagesFunction<Env, "tag"> = async ({ env, params }) => {
  const tag = String(params.tag || "");
  if (!tag) return error(400, "tag required");

  const device = await env.DB
    .prepare(
      `SELECT d.*, c.name AS customer_name, c.org AS customer_org,
              po.po_number AS po_number
       FROM devices d
       LEFT JOIN customers c        ON c.id = d.customer_id
       LEFT JOIN purchase_orders po ON po.id = d.po_id
       WHERE d.tag = ?1`
    )
    .bind(tag)
    .first<Record<string, unknown> & { id: number; redactions: string | null }>();
  if (!device) return error(404, "device not found");

  const events = await env.DB
    .prepare(
      `SELECT id, event_type, from_state, to_state, actor, payload, occurred_at
       FROM device_events WHERE device_id = ?1 ORDER BY occurred_at DESC, id DESC`
    )
    .bind(device.id)
    .all();

  const photos = await env.DB
    .prepare(
      `SELECT id, phase, r2_key, caption, uploaded_at
       FROM device_photos WHERE device_id = ?1 ORDER BY uploaded_at DESC`
    )
    .bind(device.id)
    .all();

  // Hydrate redactions JSON for the client.
  let redactions: string[] = [];
  if (device.redactions) {
    try { redactions = JSON.parse(device.redactions); } catch { /* ignore */ }
  }

  return json({
    device: { ...device, redactions },
    events: events.results,
    photos: photos.results,
  });
};

export const onRequestPatch: PagesFunction<Env, "tag"> = ({ env, params, request }) =>
  handle(async () => {
    const actor = requireActor(request);
    const tag = String(params.tag || "");
    const body = await parseJson<{
      model?: string; serial_number?: string; imei?: string;
      technician?: string; notes?: string; redactions?: string[];
      box_tag?: string;
    }>(request);

    const sets: string[] = [];
    const binds: unknown[] = [];
    const add = (col: string, val: unknown) => {
      binds.push(val);
      sets.push(`${col} = ?${binds.length}`);
    };
    if (body.model !== undefined)         add("model", body.model);
    if (body.serial_number !== undefined) add("serial_number", body.serial_number);
    if (body.imei !== undefined)          add("imei", body.imei);
    if (body.technician !== undefined)    add("technician", body.technician);
    if (body.notes !== undefined)         add("notes", body.notes);
    if (body.box_tag !== undefined)       add("box_tag", body.box_tag);
    if (body.redactions !== undefined)    add("redactions", JSON.stringify(body.redactions));
    if (!sets.length) return error(400, "no fields to update");

    binds.push(tag);
    const row = await env.DB
      .prepare(`UPDATE devices SET ${sets.join(", ")} WHERE tag = ?${binds.length} RETURNING id`)
      .bind(...binds)
      .first<{ id: number }>();
    if (!row) return error(404, "device not found");

    await logEvent(env.DB, {
      deviceId: row.id,
      eventType: "UPDATE",
      actor,
      payload: body as unknown as Record<string, unknown>,
    });
    return json({ ok: true });
  });
