// GET  /api/customers          — list (newest first)
// POST /api/customers          — create
import { Env, json, error, handle, requireActor } from "./_utils";
import { parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = ({ env }) =>
  handle(async () => {
    const { results } = await env.DB
      .prepare(
        `SELECT c.id, c.name, c.org, c.email, c.phone, c.created_at,
                (SELECT COUNT(*) FROM purchase_orders po WHERE po.customer_id = c.id) AS po_count,
                (SELECT COUNT(*) FROM devices d        WHERE d.customer_id = c.id) AS device_count
         FROM customers c
         ORDER BY c.created_at DESC`
      )
      .all();
    return json({ customers: results });
  });

export const onRequestPost: PagesFunction<Env> = ({ env, request }) =>
  handle(async () => {
    requireActor(request);
    const body = await parseJson<{
      name?: string; org?: string; email?: string; phone?: string;
      billing_address?: string; notes?: string;
    }>(request);
    const name = (body.name || "").trim();
    if (!name) return error(400, "name is required");
    const row = await env.DB
      .prepare(
        `INSERT INTO customers (name, org, email, phone, billing_address, notes)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6) RETURNING *`
      )
      .bind(
        name,
        body.org || null,
        body.email || null,
        body.phone || null,
        body.billing_address || null,
        body.notes || null
      )
      .first();
    return json({ customer: row }, { status: 201 });
  });
