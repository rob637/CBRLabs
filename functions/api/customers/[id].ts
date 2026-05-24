// GET   /api/customers/:id — full detail including POs and devices
// PATCH /api/customers/:id — update editable fields
import { Env, json, error, handle, requireActor } from "../_utils";
import { parseJson } from "../_db";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, "invalid id");

  const customer = await env.DB
    .prepare("SELECT * FROM customers WHERE id = ?1")
    .bind(id)
    .first();
  if (!customer) return error(404, "customer not found");

  const pos = await env.DB
    .prepare(
      `SELECT id, po_number, status, quoted_amount_cents, due_date, created_at
       FROM purchase_orders WHERE customer_id = ?1 ORDER BY created_at DESC`
    )
    .bind(id)
    .all();

  const devices = await env.DB
    .prepare(
      `SELECT id, tag, platform, model, serial_number, state, po_id, created_at
       FROM devices WHERE customer_id = ?1 ORDER BY created_at DESC LIMIT 200`
    )
    .bind(id)
    .all();

  return json({ customer, purchase_orders: pos.results, devices: devices.results });
};

export const onRequestPatch: PagesFunction<Env, "id"> = ({ env, request, params }) =>
  handle(async () => {
    requireActor(request);
    const id = Number(params.id);
    if (!Number.isFinite(id)) return error(400, "invalid id");
    const body = await parseJson<{
      name?: string; org?: string; email?: string; phone?: string;
      billing_address?: string | null; notes?: string | null;
    }>(request);

    const fields: Array<[string, unknown]> = [];
    if (body.name !== undefined)            fields.push(["name", (body.name || "").trim()]);
    if (body.org !== undefined)             fields.push(["org", body.org || null]);
    if (body.email !== undefined)           fields.push(["email", body.email || null]);
    if (body.phone !== undefined)           fields.push(["phone", body.phone || null]);
    if (body.billing_address !== undefined) fields.push(["billing_address", body.billing_address || null]);
    if (body.notes !== undefined)           fields.push(["notes", body.notes || null]);
    if (!fields.length) return json({ ok: true, customer: null });

    const sets = fields.map(([k], i) => `${k} = ?${i + 1}`).join(", ");
    const binds = fields.map(([, v]) => v);
    binds.push(id);
    const row = await env.DB
      .prepare(`UPDATE customers SET ${sets} WHERE id = ?${binds.length} RETURNING *`)
      .bind(...binds)
      .first();
    return json({ ok: true, customer: row });
  });

