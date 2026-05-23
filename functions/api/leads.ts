// /api/leads  — admin list of inbound leads (write happens at /public/leads)
import { Env, json, handle, requireActor, paginate } from "./_utils";
import { parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const { limit, offset } = paginate(url);
  const sql = status
    ? "SELECT * FROM leads WHERE status = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    : "SELECT * FROM leads ORDER BY created_at DESC LIMIT ?1 OFFSET ?2";
  const rs = status
    ? await env.DB.prepare(sql).bind(status, limit, offset).all()
    : await env.DB.prepare(sql).bind(limit, offset).all();
  return json({ leads: rs.results, limit, offset });
});

interface PatchBody {
  ids: number[];
  status?: string;
  notes?: string;
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  requireActor(request);
  const b = await parseJson<PatchBody>(request);
  if (!b.ids?.length) throw new Error("ids required");
  for (const id of b.ids) {
    const sets: string[] = [];
    const binds: unknown[] = [];
    if (b.status) { sets.push(`status = ?${binds.length + 1}`); binds.push(b.status); }
    if (b.notes !== undefined) { sets.push(`notes = ?${binds.length + 1}`); binds.push(b.notes); }
    if (!sets.length) continue;
    binds.push(id);
    await env.DB.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?${binds.length}`)
      .bind(...binds).run();
  }
  return json({ ok: true });
});
