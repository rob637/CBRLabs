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

// ---------- Upload guards ------------------------------------------------
// Hard caps to prevent runaway R2 bills + DoS from giant uploads.
export const MAX_PHOTO_BYTES    = 25 * 1024 * 1024;  // 25 MB per photo
export const MAX_DOCUMENT_BYTES = 50 * 1024 * 1024;  // 50 MB per document

const PHOTO_MIME = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif",
]);

const DOC_MIME = new Set([
  "application/pdf",
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain", "text/csv",
]);

export function assertPhoto(file: File): void {
  if (file.size === 0) throw new HttpError(400, "empty file");
  if (file.size > MAX_PHOTO_BYTES) {
    throw new HttpError(413, `photo too large (max ${Math.floor(MAX_PHOTO_BYTES / 1024 / 1024)} MB)`);
  }
  const type = (file.type || "").toLowerCase();
  if (type && !PHOTO_MIME.has(type)) {
    throw new HttpError(415, `unsupported image type: ${type}`);
  }
}

export function assertDocument(file: File): void {
  if (file.size === 0) throw new HttpError(400, "empty file");
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new HttpError(413, `file too large (max ${Math.floor(MAX_DOCUMENT_BYTES / 1024 / 1024)} MB)`);
  }
  const type = (file.type || "").toLowerCase();
  if (type && !DOC_MIME.has(type)) {
    throw new HttpError(415, `unsupported document type: ${type}`);
  }
}

// ---------- Pagination ---------------------------------------------------
// Default page is 200 rows; hard cap 1000. Callers SHOULD append
// `LIMIT ?N OFFSET ?M` and bind paginate(url) values.
export interface PageParams { limit: number; offset: number; }

export function paginate(url: URL, defaultLimit = 200, maxLimit = 1000): PageParams {
  const rawLimit = Number(url.searchParams.get("limit"));
  const rawOffset = Number(url.searchParams.get("offset"));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(maxLimit, Math.floor(rawLimit))
    : defaultLimit;
  const offset = Number.isFinite(rawOffset) && rawOffset >= 0
    ? Math.floor(rawOffset)
    : 0;
  return { limit, offset };
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
