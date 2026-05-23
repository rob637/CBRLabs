// /api/documents  — list + upload corporate documents to R2
import { Env, json, handle, requireActor, paginate, assertDocument, HttpError } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const { limit, offset } = paginate(url);
  const sql = kind
    ? "SELECT * FROM documents WHERE kind = ?1 ORDER BY uploaded_at DESC LIMIT ?2 OFFSET ?3"
    : "SELECT * FROM documents ORDER BY uploaded_at DESC LIMIT ?1 OFFSET ?2";
  const rs = kind
    ? await env.DB.prepare(sql).bind(kind, limit, offset).all()
    : await env.DB.prepare(sql).bind(limit, offset).all();
  return json({ documents: rs.results });
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) throw new HttpError(400, "file required");
  assertDocument(file);
  const kind = (form.get("kind") as string) || "OTHER";
  const name = (form.get("name") as string) || file.name;
  const expires_at = (form.get("expires_at") as string) || null;
  const notes = (form.get("notes") as string) || null;

  const ts = Date.now();
  const safe = name.replace(/[^a-z0-9._-]/gi, "_").slice(0, 120);
  const key = `documents/${kind}/${ts}_${safe}`;
  await env.FILES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const row = await env.DB
    .prepare(`INSERT INTO documents (kind, name, r2_key, expires_at, notes)
              VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id`)
    .bind(kind, name, key, expires_at, notes)
    .first<{ id: number }>();
  return json({ id: row!.id, r2_key: key }, { status: 201 });
});
