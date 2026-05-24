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

interface LeadEnv extends Env {
  RESEND_API_KEY?: string;
  LEADS_TO_EMAIL?: string;
  LEADS_FROM_EMAIL?: string;
}

export const onRequestPost: PagesFunction<LeadEnv> = async ({ request, env }) => handle(async () => {
  const b = await parseJson<LeadBody>(request);
  if (b.hp) return json({ ok: true }); // silently drop bots
  if (!b.name?.trim()) throw new Error("name required");
  if (!b.email?.trim() && !b.phone?.trim()) throw new Error("email or phone required");

  const ip = request.headers.get("cf-connecting-ip") || null;
  const ua = request.headers.get("user-agent") || null;

  const insert = await env.DB
    .prepare(`INSERT INTO leads
      (name, email, phone, org, use_case, device_count, timeline, message, source, ip, user_agent)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`)
    .bind(b.name.trim(), b.email || null, b.phone || null, b.org || null,
          b.use_case || null, b.device_count || null, b.timeline || null,
          b.message || null, b.source || "contact-form", ip, ua)
    .run();

  // Best-effort email notification. Never blocks the form response.
  // Set RESEND_API_KEY in Cloudflare Pages → Settings → Environment variables
  // (and verify your domain in Resend so the From address works).
  try {
    await sendLeadEmail(env, b, insert.meta?.last_row_id, ip);
  } catch (e) {
    console.error("lead email failed:", e instanceof Error ? e.message : e);
  }

  return json({ ok: true }, { status: 201 });
});

async function sendLeadEmail(
  env: LeadEnv,
  b: LeadBody,
  leadId: number | undefined,
  ip: string | null,
) {
  if (!env.RESEND_API_KEY) return; // dormant until key is set
  const to = env.LEADS_TO_EMAIL || "rob@cbr-labs.com";
  const from = env.LEADS_FROM_EMAIL || "CBR Labs Leads <leads@cbr-labs.com>";

  const safe = (v: string | null | undefined) =>
    (v || "—").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));

  const rows: [string, string | undefined | null][] = [
    ["Name", b.name],
    ["Organization", b.org],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Device count", b.device_count],
    ["Timeline", b.timeline],
    ["Use case", b.use_case],
    ["Details", b.message],
    ["Source", b.source || "contact-form"],
    ["IP", ip],
    ["Lead #", leadId ? String(leadId) : null],
  ];

  const html = `
    <div style="font:14px/1.5 -apple-system,Segoe UI,sans-serif;color:#0B0E13">
      <h2 style="margin:0 0 12px;font:600 18px/1.3 -apple-system,Segoe UI,sans-serif">
        New lead — ${safe(b.name)}${b.org ? " · " + safe(b.org) : ""}
      </h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="vertical-align:top;color:#6E737A;width:130px;border-bottom:1px solid #eee">${k}</td>
            <td style="vertical-align:top;border-bottom:1px solid #eee;white-space:pre-wrap">${safe(v)}</td>
          </tr>`).join("")}
      </table>
      <p style="margin-top:16px;color:#6E737A;font-size:12px">
        Review in the admin: <a href="https://cbr-labs.com/admin/leads">/admin/leads</a>
      </p>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
  const replyTo = b.email?.trim() || undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject: `New lead: ${b.name}${b.org ? " (" + b.org + ")" : ""}`,
      html,
      text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

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
