// /api/documents/:id  — stream file, delete row
import { Env, json, handle, requireActor, HttpError } from "../_utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  requireActor(request);
  const id = Number(params.id);
  const row = await env.DB
    .prepare("SELECT r2_key, name FROM documents WHERE id = ?1")
    .bind(id).first<{ r2_key: string; name: string }>();
  if (!row) throw new HttpError(404, "Document not found");
  const obj = await env.FILES.get(row.r2_key);
  if (!obj) throw new HttpError(404, "File missing");
  return new Response(obj.body, {
    headers: {
      "content-type": obj.httpMetadata?.contentType || "application/octet-stream",
      "content-disposition": `inline; filename="${row.name.replace(/"/g, "")}"`,
      "cache-control": "private, max-age=300",
    },
  });
});

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => handle(async () => {
  requireActor(request);
  const id = Number(params.id);
  const row = await env.DB
    .prepare("SELECT r2_key FROM documents WHERE id = ?1")
    .bind(id).first<{ r2_key: string }>();
  if (!row) throw new HttpError(404, "Document not found");
  try { await env.FILES.delete(row.r2_key); } catch { /* ignore */ }
  await env.DB.prepare("DELETE FROM documents WHERE id = ?1").bind(id).run();
  return json({ ok: true });
});
