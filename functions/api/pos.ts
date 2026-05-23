// GET  /api/pos       — list with customer name
// POST /api/pos       — create (mints po_number)
import { Env, json, error, handle, requireActor } from "./_utils";
import { mintPONumber, parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = ({ env, request }) =>
  handle(async () => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const customerId = url.searchParams.get("customer_id");
    const where: string[] = [];
    const binds: unknown[] = [];
    if (status)     { where.push(`po.status = ?${binds.length + 1}`);      binds.push(status); }
    if (customerId) { where.push(`po.customer_id = ?${binds.length + 1}`); binds.push(Number(customerId)); }
    const sql = `
      SELECT po.id, po.po_number, po.status, po.quoted_amount_cents, po.due_date,
             po.created_at, po.customer_id, c.name AS customer_name, c.org AS customer_org,
             (SELECT COUNT(*) FROM devices d WHERE d.po_id = po.id) AS device_count
      FROM purchase_orders po
      JOIN customers c ON c.id = po.customer_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY po.created_at DESC`;
    const { results } = await env.DB.prepare(sql).bind(...binds).all();
    return json({ purchase_orders: results });
  });

export const onRequestPost: PagesFunction<Env> = ({ env, request }) =>
  handle(async () => {
    requireActor(request);
    const body = await parseJson<{
      customer_id?: number; scope_notes?: string;
      quoted_amount_cents?: number; due_date?: string;
    }>(request);
    if (!body.customer_id) return error(400, "customer_id is required");

    const po_number = await mintPONumber(env.DB);
    const row = await env.DB
      .prepare(
        `INSERT INTO purchase_orders
           (po_number, customer_id, scope_notes, quoted_amount_cents, due_date)
         VALUES (?1, ?2, ?3, ?4, ?5) RETURNING *`
      )
      .bind(
        po_number,
        body.customer_id,
        body.scope_notes || null,
        body.quoted_amount_cents || null,
        body.due_date || null
      )
      .first();
    return json({ purchase_order: row }, { status: 201 });
  });
