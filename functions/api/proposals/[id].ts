// /api/proposals/:id  — GET (with lines + share token), PATCH (status + lines)
import { Env, json, handle, requireActor, HttpError } from "../_utils";
import { parseJson, generateToken } from "../_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  requireActor(request);
  const id = Number(params.id);
  const prop = await env.DB
    .prepare(`SELECT p.*, c.name AS customer_name, c.email AS customer_email
              FROM proposals p
              LEFT JOIN customers c ON c.id = p.customer_id
              WHERE p.id = ?1`)
    .bind(id).first();
  if (!prop) throw new HttpError(404, "Proposal not found");
  const lines = await env.DB
    .prepare("SELECT * FROM proposal_lines WHERE proposal_id = ?1 ORDER BY position, id")
    .bind(id).all();
  const tok = await env.DB
    .prepare("SELECT token FROM share_tokens WHERE kind = 'PROPOSAL' AND target_id = ?1 AND revoked_at IS NULL LIMIT 1")
    .bind(id).first<{ token: string }>();
  return json({ proposal: prop, lines: lines.results, share_token: tok?.token || null });
});

interface PatchBody {
  status?: string;
  title?: string;
  scope_summary?: string | null;
  terms?: string | null;
  valid_until?: string | null;
  notes?: string | null;
  tax_cents?: number;
  lines?: Array<{ description: string; quantity: number; unit_price_cents: number }>;
  mint_share_token?: boolean;
  mark_sent?: boolean;
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  const actor = requireActor(request);
  const id = Number(params.id);
  const b = await parseJson<PatchBody>(request);

  const sets: string[] = [];
  const binds: unknown[] = [];
  for (const [k, v] of [
    ["status", b.status], ["title", b.title], ["scope_summary", b.scope_summary],
    ["terms", b.terms], ["valid_until", b.valid_until], ["notes", b.notes],
  ] as const) {
    if (v !== undefined) { sets.push(`${k} = ?${binds.length + 1}`); binds.push(v); }
  }
  if (b.mark_sent) {
    sets.push(`status = ?${binds.length + 1}`); binds.push("SENT");
    sets.push(`sent_at = datetime('now')`);
  }

  if (b.lines) {
    await env.DB.prepare("DELETE FROM proposal_lines WHERE proposal_id = ?1").bind(id).run();
    const sub = b.lines.reduce((s, l) => s + l.unit_price_cents * l.quantity, 0);
    const tax = b.tax_cents ?? 0;
    sets.push(`subtotal_cents = ?${binds.length + 1}`); binds.push(sub);
    sets.push(`tax_cents = ?${binds.length + 1}`); binds.push(tax);
    sets.push(`total_cents = ?${binds.length + 1}`); binds.push(sub + tax);
    for (let i = 0; i < b.lines.length; i++) {
      const l = b.lines[i];
      await env.DB
        .prepare(`INSERT INTO proposal_lines
          (proposal_id, position, description, quantity, unit_price_cents, amount_cents)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
        .bind(id, i, l.description, l.quantity, l.unit_price_cents,
              l.unit_price_cents * l.quantity)
        .run();
    }
  }

  if (sets.length) {
    binds.push(id);
    await env.DB.prepare(`UPDATE proposals SET ${sets.join(", ")} WHERE id = ?${binds.length}`)
      .bind(...binds).run();
  }

  let token: string | null = null;
  if (b.mint_share_token) {
    const existing = await env.DB
      .prepare("SELECT token FROM share_tokens WHERE kind = 'PROPOSAL' AND target_id = ?1 AND revoked_at IS NULL LIMIT 1")
      .bind(id).first<{ token: string }>();
    if (existing) token = existing.token;
    else {
      token = generateToken();
      await env.DB
        .prepare("INSERT INTO share_tokens (token, kind, target_id, created_by) VALUES (?1, 'PROPOSAL', ?2, ?3)")
        .bind(token, id, actor).run();
    }
  }

  return json({ ok: true, share_token: token });
});
