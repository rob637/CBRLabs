// GET /api/photos/:id — stream the photo from R2 (Cloudflare Access required)
import { Env, error, handle } from "../_utils";

export const onRequestGet: PagesFunction<Env, "id"> = ({ env, params }) =>
  handle(async () => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return error(400, "invalid id");
    const row = await env.DB
      .prepare("SELECT r2_key FROM device_photos WHERE id = ?1")
      .bind(id)
      .first<{ r2_key: string }>();
    if (!row) return error(404, "photo not found");
    const obj = await env.FILES.get(row.r2_key);
    if (!obj) return error(404, "object missing");
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("cache-control", "private, max-age=600");
    return new Response(obj.body, { headers });
  });
