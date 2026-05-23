// /api/receipts  — list + create payment. Auto-marks invoice PAID when fully covered.
import { Env, json, handle, requireActor } from "./_utils";
import { parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const invoiceId = url.searchParams.get("invoice_id");
  const customerId = url.searchParams.get("customer_id");
  const where: string[] = [];
  const binds: unknown[] = [];
  if (invoiceId)  { where.push(`r.invoice_id = ?${binds.length + 1}`);  binds.push(Number(invoiceId)); }
  if (customerId) { where.push(`r.customer_id = ?${binds.length + 1}`); binds.push(Number(customerId)); }
  const sql = `
    SELECT r.*, c.name AS customer_name, i.invoice_number, i.total_cents AS invoice_total
    FROM cash_receipts r
    LEFT JOIN customers c ON c.id = r.customer_id
    LEFT JOIN invoices  i ON i.id = r.invoice_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY r.received_at DESC, r.id DESC
    LIMIT 500`;
  const rs = await env.DB.prepare(sql).bind(...binds).all();
  return json({ receipts: rs.results });
});

interface CreateBody {
  invoice_id?: number | null;
  customer_id?: number | null;
  amount_cents: number;
  method: "CHECK" | "WIRE" | "ACH" | "CARD" | "CASH" | "OTHER";
  received_at?: string;
  reference?: string | null;
  notes?: string | null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const b = await parseJson<CreateBody>(request);
  if (!b.amount_cents || !b.method) throw new Error("amount_cents and method required");

  // Hydrate customer_id from invoice if missing
  let customerId = b.customer_id || null;
  if (!customerId && b.invoice_id) {
    const inv = await env.DB
      .prepare("SELECT customer_id FROM invoices WHERE id = ?1")
      .bind(b.invoice_id).first<{ customer_id: number }>();
    customerId = inv?.customer_id || null;
  }

  const created = await env.DB
    .prepare(`INSERT INTO cash_receipts
      (invoice_id, customer_id, received_at, amount_cents, method, reference, notes)
      VALUES (?1, ?2, COALESCE(?3, date('now')), ?4, ?5, ?6, ?7) RETURNING id`)
    .bind(b.invoice_id || null, customerId, b.received_at || null,
          b.amount_cents, b.method, b.reference || null, b.notes || null)
    .first<{ id: number }>();

  // Auto-mark invoice PAID / PARTIAL
  if (b.invoice_id) {
    const totals = await env.DB
      .prepare(`SELECT i.total_cents,
                       COALESCE(SUM(r.amount_cents), 0) AS paid
                FROM invoices i
                LEFT JOIN cash_receipts r ON r.invoice_id = i.id
                WHERE i.id = ?1
                GROUP BY i.id`)
      .bind(b.invoice_id)
      .first<{ total_cents: number; paid: number }>();
    if (totals) {
      const next = totals.paid >= totals.total_cents ? "PAID" : "PARTIAL";
      await env.DB.prepare("UPDATE invoices SET status = ?1 WHERE id = ?2 AND status NOT IN ('VOID')")
        .bind(next, b.invoice_id).run();
    }
  }
  return json({ id: created!.id }, { status: 201 });
});
