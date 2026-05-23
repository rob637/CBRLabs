// Shared helpers for Cloudflare Pages Functions under /api/*.

export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  COMPANY_NAME: string;
  COMPANY_EMAIL: string;
  COMPANY_PHONE: string;
  COMPANY_ADDRESS_1: string;
  COMPANY_ADDRESS_2: string;
  COMPANY_CAGE: string;
  COMPANY_UEI: string;
  INVOICE_PREFIX: string;
  TAG_YEAR_PREFIX: string;
}

export const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });

export const error = (status: number, message: string, extra?: Record<string, unknown>) =>
  json({ error: message, ...extra }, { status });

// Cloudflare Access populates this header with the verified user's email
// once the route is protected by an Access policy. If it's missing we are
// either in local dev or someone bypassed Access — refuse to write.
export const actorFromRequest = (req: Request): string | null =>
  req.headers.get("cf-access-authenticated-user-email") || null;

export const requireActor = (req: Request): string => {
  const actor = actorFromRequest(req);
  if (!actor) throw new HttpError(401, "Cloudflare Access identity missing");
  return actor;
};

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const handle = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError) return error(e.status, e.message);
    const msg = e instanceof Error ? e.message : "Internal error";
    return error(500, msg);
  }
};
