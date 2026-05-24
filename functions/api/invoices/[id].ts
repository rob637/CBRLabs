// /api/invoices/:id  — GET full record, PATCH status/notes/lines
import { Env, json, handle, requireActor, HttpError } from "../_utils";
import { parseJson } from "../_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  requireActor(request);
  const id = Number(params.id);
  const inv = await env.DB
    .prepare(`SELECT i.*, c.name AS customer_name, c.org AS customer_org,
                     c.email AS customer_email, c.phone AS customer_phone,
                     c.billing_address, p.po_number
              FROM invoices i
              LEFT JOIN customers c ON c.id = i.customer_id
              LEFT JOIN purchase_orders p ON p.id = i.po_id
              WHERE i.id = ?1`)
    .bind(id).first();
  if (!inv) throw new HttpError(404, "Invoice not found");
  const lines = await env.DB.prepare("SELECT * FROM invoice_lines WHERE invoice_id = ?1 ORDER BY id").bind(id).all();
  const receipts = await env.DB.prepare("SELECT * FROM cash_receipts WHERE invoice_id = ?1 ORDER BY received_at DESC").bind(id).all();
  return json({ invoice: inv, lines: lines.results, receipts: receipts.results });
});

interface PatchBody {
  status?: string;
  notes?: string | null;
  due_date?: string | null;
  tax_cents?: number;
  lines?: Array<{ description: string; quantity: number; unit_price_cents: number; device_id?: number | null }>;
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  requireActor(request);
  const id = Number(params.id);
  const body = await parseJson<PatchBody>(request);

  const sets: string[] = [];
  const binds: unknown[] = [];
  if (body.status) { sets.push(`status = ?${binds.length + 1}`); binds.push(body.status); }
  if (body.notes !== undefined) { sets.push(`notes = ?${binds.length + 1}`); binds.push(body.notes); }
  if (body.due_date !== undefined) { sets.push(`due_date = ?${binds.length + 1}`); binds.push(body.due_date); }

  // Replace lines if provided
  if (body.lines) {
    await env.DB.prepare("DELETE FROM invoice_lines WHERE invoice_id = ?1").bind(id).run();
    const sub = body.lines.reduce((s, l) => s + l.unit_price_cents * l.quantity, 0);
    const tax = body.tax_cents ?? 0;
    sets.push(`subtotal_cents = ?${binds.length + 1}`); binds.push(sub);
    sets.push(`tax_cents = ?${binds.length + 1}`); binds.push(tax);
    sets.push(`total_cents = ?${binds.length + 1}`); binds.push(sub + tax);
    for (const l of body.lines) {
      await env.DB
        .prepare(`INSERT INTO invoice_lines
          (invoice_id, description, quantity, unit_price_cents, amount_cents, device_id)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
        .bind(id, l.description, l.quantity, l.unit_price_cents,
              l.unit_price_cents * l.quantity, l.device_id || null)
        .run();
    }
  }

  if (sets.length) {
    binds.push(id);
    await env.DB.prepare(`UPDATE invoices SET ${sets.join(", ")} WHERE id = ?${binds.length}`)
      .bind(...binds).run();
  }
  return json({ ok: true });
});
