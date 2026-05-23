import { json, type Env } from "./_utils";

// GET /api/health — proves Functions + D1 binding are alive.
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  let dbStatus: "ok" | "unbound" | "error" = "unbound";
  let dbError: string | undefined;
  let counts: Record<string, number> = {};

  if (env.DB) {
    try {
      const tables = await env.DB
        .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        .all<{ name: string }>();
      dbStatus = "ok";
      counts = { tables: tables.results?.length ?? 0 };
    } catch (e) {
      dbStatus = "error";
      dbError = e instanceof Error ? e.message : String(e);
    }
  }

  return json({
    ok: true,
    timestamp: new Date().toISOString(),
    db: dbStatus,
    dbError,
    counts,
    filesBound: !!env.FILES,
    accessUser: request.headers.get("cf-access-authenticated-user-email") || null,
  });
};
