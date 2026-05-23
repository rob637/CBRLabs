// POST /api/devices/:tag/photos   — multipart upload to R2
//   form fields: file (required), phase ('INTAKE'|'BEFORE'|'AFTER'|'SHIPPING'), caption?
//
// iPhone-friendly: <input type="file" accept="image/*" capture="environment">
// posts directly here.
import { Env, json, error, handle, requireActor, assertPhoto } from "../../_utils";
import { logEvent } from "../../_db";

const VALID_PHASES = new Set(["INTAKE", "BEFORE", "AFTER", "SHIPPING"]);

export const onRequestPost: PagesFunction<Env, "tag"> = ({ env, params, request }) =>
  handle(async () => {
    const actor = requireActor(request);
    const tag = String(params.tag || "");

    const device = await env.DB
      .prepare("SELECT id FROM devices WHERE tag = ?1")
      .bind(tag)
      .first<{ id: number }>();
    if (!device) return error(404, "device not found");

    const form = await request.formData();
    const file = form.get("file");
    const phase = String(form.get("phase") || "INTAKE").toUpperCase();
    const caption = form.get("caption");

    if (!(file instanceof File)) return error(400, "file is required");
    if (!VALID_PHASES.has(phase)) return error(400, "invalid phase");
    assertPhoto(file);

    const ext = guessExt(file.name, file.type);
    const ts = Date.now();
    const key = `photos/${device.id}/${ts}_${phase}${ext}`;

    await env.FILES.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { device_tag: tag, phase, actor },
    });

    const row = await env.DB
      .prepare(
        `INSERT INTO device_photos (device_id, phase, r2_key, caption)
         VALUES (?1, ?2, ?3, ?4) RETURNING id, phase, r2_key, caption, uploaded_at`
      )
      .bind(device.id, phase, key, typeof caption === "string" ? caption : null)
      .first();

    await logEvent(env.DB, {
      deviceId: device.id,
      eventType: "PHOTO",
      actor,
      payload: { phase, r2_key: key, caption: typeof caption === "string" ? caption : null },
    });

    return json({ photo: row }, { status: 201 });
  });

function guessExt(name: string, type: string): string {
  const m = /\.(jpg|jpeg|png|webp|heic|heif)$/i.exec(name || "");
  if (m) return `.${m[1].toLowerCase()}`;
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/png")  return ".png";
  if (type === "image/webp") return ".webp";
  if (type === "image/heic" || type === "image/heif") return ".heic";
  return ".bin";
}
