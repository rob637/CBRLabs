// /api/invoices  — list + create
import { Env, json, handle, requireActor } from "./_utils";
import { mintInvoiceNumber, parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const customerId = url.searchParams.get("customer_id");
  const where: string[] = [];
  const binds: unknown[] = [];
  if (status) { where.push(`i.status = ?${binds.length + 1}`); binds.push(status); }
  if (customerId) { where.push(`i.customer_id = ?${binds.length + 1}`); binds.push(Number(customerId)); }
  const sql = `
    SELECT i.*,
           c.name AS customer_name,
           p.po_number,
           COALESCE((SELECT SUM(amount_cents) FROM cash_receipts r WHERE r.invoice_id = i.id), 0) AS paid_cents
    FROM invoices i
    LEFT JOIN customers c ON c.id = i.customer_id
    LEFT JOIN purchase_orders p ON p.id = i.po_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY i.created_at DESC
    LIMIT 500`;
  const rs = await env.DB.prepare(sql).bind(...binds).all();
  return json({ invoices: rs.results });
});

interface CreateBody {
  customer_id: number;
  po_id?: number | null;
  due_date?: string | null;
  notes?: string | null;
  lines?: Array<{ description: string; quantity: number; unit_price_cents: number; device_id?: number | null }>;
  tax_cents?: number;
  from_po?: boolean; // auto-add 1 line per device on the PO
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const body = await parseJson<CreateBody>(request);
  if (!body.customer_id) throw new Error("customer_id required");

  let lines = body.lines || [];

  // Auto-populate lines from PO devices if requested
  if (body.from_po && body.po_id) {
    const po = await env.DB
      .prepare("SELECT * FROM purchase_orders WHERE id = ?1")
      .bind(body.po_id)
      .first<{ quoted_amount_cents: number | null }>();
    const devices = await env.DB
      .prepare("SELECT id, tag, model, serial_number FROM devices WHERE po_id = ?1 ORDER BY id")
      .bind(body.po_id)
      .all<{ id: number; tag: string; model: string | null; serial_number: string | null }>();
    const count = devices.results.length;
    const unit = count && po?.quoted_amount_cents ? Math.floor(po.quoted_amount_cents / count) : 0;
    lines = devices.results.map((d) => ({
      description: `${d.tag} · Hardware redaction · ${d.model || "device"}${d.serial_number ? " · " + d.serial_number : ""}`,
      quantity: 1,
      unit_price_cents: unit,
      device_id: d.id,
    }));
  }

  const subtotal = lines.reduce((s, l) => s + l.unit_price_cents * l.quantity, 0);
  const tax = body.tax_cents || 0;
  const total = subtotal + tax;
  const invoiceNumber = await mintInvoiceNumber(env.DB);

  const inv = await env.DB
    .prepare(`INSERT INTO invoices
      (invoice_number, customer_id, po_id, status, due_date, subtotal_cents, tax_cents, total_cents, notes)
      VALUES (?1, ?2, ?3, 'DRAFT', ?4, ?5, ?6, ?7, ?8)
      RETURNING id`)
    .bind(invoiceNumber, body.customer_id, body.po_id || null, body.due_date || null,
          subtotal, tax, total, body.notes || null)
    .first<{ id: number }>();

  for (const l of lines) {
    await env.DB
      .prepare(`INSERT INTO invoice_lines
        (invoice_id, description, quantity, unit_price_cents, amount_cents, device_id)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
      .bind(inv!.id, l.description, l.quantity, l.unit_price_cents,
            l.unit_price_cents * l.quantity, l.device_id || null)
      .run();
  }
  return json({ id: inv!.id, invoice_number: invoiceNumber }, { status: 201 });
});
