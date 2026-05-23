// GET   /api/pos/:id  — detail with devices
// PATCH /api/pos/:id  — update status / fields
import { Env, json, error, handle, requireActor } from "../_utils";
import { parseJson } from "../_db";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return error(400, "invalid id");
  const po = await env.DB
    .prepare(
      `SELECT po.*, c.name AS customer_name, c.org AS customer_org, c.email AS customer_email
       FROM purchase_orders po
       JOIN customers c ON c.id = po.customer_id
       WHERE po.id = ?1`
    )
    .bind(id)
    .first();
  if (!po) return error(404, "po not found");

  const devices = await env.DB
    .prepare(
      `SELECT id, tag, box_tag, platform, model, serial_number, state, technician, cert_number, created_at
       FROM devices WHERE po_id = ?1 ORDER BY tag`
    )
    .bind(id)
    .all();
  return json({ purchase_order: po, devices: devices.results });
};

export const onRequestPatch: PagesFunction<Env, "id"> = ({ env, params, request }) =>
  handle(async () => {
    requireActor(request);
    const id = Number(params.id);
    if (!Number.isFinite(id)) return error(400, "invalid id");
    const body = await parseJson<{
      status?: string; scope_notes?: string;
      quoted_amount_cents?: number; due_date?: string;
    }>(request);

    const sets: string[] = [];
    const binds: unknown[] = [];
    const add = (col: string, val: unknown) => {
      binds.push(val);
      sets.push(`${col} = ?${binds.length}`);
    };
    if (body.status !== undefined)              add("status", body.status);
    if (body.scope_notes !== undefined)         add("scope_notes", body.scope_notes);
    if (body.quoted_amount_cents !== undefined) add("quoted_amount_cents", body.quoted_amount_cents);
    if (body.due_date !== undefined)            add("due_date", body.due_date);
    if (!sets.length) return error(400, "no fields to update");

    binds.push(id);
    const row = await env.DB
      .prepare(`UPDATE purchase_orders SET ${sets.join(", ")} WHERE id = ?${binds.length} RETURNING *`)
      .bind(...binds)
      .first();
    return json({ purchase_order: row });
  });
