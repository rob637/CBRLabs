// /api/proposals  — list + create
import { Env, json, handle, requireActor, paginate } from "./_utils";
import { mintProposalNumber, parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const { limit, offset } = paginate(url);
  const where: string[] = [];
  const binds: unknown[] = [];
  if (status) { where.push(`p.status = ?${binds.length + 1}`); binds.push(status); }
  binds.push(limit, offset);
  const sql = `
    SELECT p.*, c.name AS customer_name, l.name AS lead_name
    FROM proposals p
    LEFT JOIN customers c ON c.id = p.customer_id
    LEFT JOIN leads l ON l.id = p.lead_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY p.created_at DESC
    LIMIT ?${binds.length - 1} OFFSET ?${binds.length}`;
  const rs = await env.DB.prepare(sql).bind(...binds).all();
  return json({ proposals: rs.results, limit, offset });
});

interface CreateBody {
  title: string;
  customer_id?: number | null;
  lead_id?: number | null;
  scope_summary?: string | null;
  terms?: string | null;
  valid_until?: string | null;
  tax_cents?: number;
  lines?: Array<{ description: string; quantity: number; unit_price_cents: number }>;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const b = await parseJson<CreateBody>(request);
  if (!b.title) throw new Error("title required");

  const lines = b.lines || [];
  const subtotal = lines.reduce((s, l) => s + l.unit_price_cents * l.quantity, 0);
  const tax = b.tax_cents || 0;
  const total = subtotal + tax;

  const num = await mintProposalNumber(env.DB);
  const row = await env.DB
    .prepare(`INSERT INTO proposals
      (proposal_number, customer_id, lead_id, title, status, scope_summary, terms,
       valid_until, subtotal_cents, tax_cents, total_cents)
      VALUES (?1, ?2, ?3, ?4, 'DRAFT', ?5, ?6, ?7, ?8, ?9, ?10) RETURNING id`)
    .bind(num, b.customer_id || null, b.lead_id || null, b.title,
          b.scope_summary || null, b.terms || null, b.valid_until || null,
          subtotal, tax, total)
    .first<{ id: number }>();

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    await env.DB
      .prepare(`INSERT INTO proposal_lines
        (proposal_id, position, description, quantity, unit_price_cents, amount_cents)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
      .bind(row!.id, i, l.description, l.quantity, l.unit_price_cents,
            l.unit_price_cents * l.quantity)
      .run();
  }
  return json({ id: row!.id, proposal_number: num }, { status: 201 });
});
