// /public/leads  — POST from contact form, NO Cloudflare Access required.
// Configure CF Access to NOT cover /public/* in the dashboard.
import { Env, json, handle } from "../api/_utils";
import { parseJson } from "../api/_db";

interface LeadBody {
  name: string;
  email?: string;
  phone?: string;
  org?: string;
  use_case?: string;
  device_count?: string;
  timeline?: string;
  message?: string;
  source?: string;
  hp?: string; // honeypot — bots fill, humans don't
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => handle(async () => {
  const b = await parseJson<LeadBody>(request);
  if (b.hp) return json({ ok: true }); // silently drop bots
  if (!b.name?.trim()) throw new Error("name required");
  if (!b.email?.trim() && !b.phone?.trim()) throw new Error("email or phone required");

  const ip = request.headers.get("cf-connecting-ip") || null;
  const ua = request.headers.get("user-agent") || null;

  await env.DB
    .prepare(`INSERT INTO leads
      (name, email, phone, org, use_case, device_count, timeline, message, source, ip, user_agent)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`)
    .bind(b.name.trim(), b.email || null, b.phone || null, b.org || null,
          b.use_case || null, b.device_count || null, b.timeline || null,
          b.message || null, b.source || "contact-form", ip, ua)
    .run();

  return json({ ok: true }, { status: 201 });
});

// CORS preflight (in case form is ever embedded elsewhere)
export const onRequestOptions: PagesFunction = () =>
  new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
    },
  });
