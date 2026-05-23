// /public/proposals/:token  — public proposal view + accept/reject.
// NOT protected by Cloudflare Access. Token is unguessable.
import { Env, json, handle, HttpError } from "../../api/_utils";
import { parseJson } from "../../api/_db";

async function loadByToken(env: Env, token: string) {
  const tok = await env.DB
    .prepare(`SELECT * FROM share_tokens WHERE token = ?1 AND kind = 'PROPOSAL' AND revoked_at IS NULL`)
    .bind(token).first<{ target_id: number; expires_at: string | null }>();
  if (!tok) throw new HttpError(404, "Invalid or revoked link");
  if (tok.expires_at && new Date(tok.expires_at) < new Date()) throw new HttpError(410, "Link expired");
  const prop = await env.DB
    .prepare(`SELECT p.*, c.name AS customer_name
              FROM proposals p
              LEFT JOIN customers c ON c.id = p.customer_id
              WHERE p.id = ?1`)
    .bind(tok.target_id).first();
  if (!prop) throw new HttpError(404, "Proposal not found");
  const lines = await env.DB
    .prepare("SELECT * FROM proposal_lines WHERE proposal_id = ?1 ORDER BY position, id")
    .bind(tok.target_id).all();
  return { tok, proposal: prop, lines: lines.results };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  const { tok, proposal, lines } = await loadByToken(env, String(params.token));
  // Stamp VIEWED on first open
  await env.DB
    .prepare("UPDATE share_tokens SET last_used_at = datetime('now'), use_count = use_count + 1 WHERE token = ?1")
    .bind(String(params.token)).run();
  await env.DB
    .prepare(`UPDATE proposals SET status = 'VIEWED', viewed_at = COALESCE(viewed_at, datetime('now'))
              WHERE id = ?1 AND status = 'SENT'`)
    .bind(tok.target_id).run();
  return json({ proposal, lines });
});

interface RespondBody { decision: "ACCEPT" | "REJECT"; note?: string; signer_name?: string; }

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  const b = await parseJson<RespondBody>(request);
  if (b.decision !== "ACCEPT" && b.decision !== "REJECT") throw new Error("decision required");
  const { tok } = await loadByToken(env, String(params.token));
  const status = b.decision === "ACCEPT" ? "ACCEPTED" : "REJECTED";
  const note = [b.signer_name && `signed: ${b.signer_name}`, b.note].filter(Boolean).join(" — ");
  await env.DB
    .prepare(`UPDATE proposals SET status = ?1, responded_at = datetime('now'),
              response_note = ?2 WHERE id = ?3`)
    .bind(status, note || null, tok.target_id).run();
  return json({ ok: true, status });
});
