// GET /api/customers/:id — full detail including POs and devices
import { Env, json, error, handle } from "../_utils";

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
