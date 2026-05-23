// DB helpers shared by all /api/* functions.
import { HttpError } from "./_utils";

/** Atomically increment a counter and return its new value. */
export async function mintCounter(db: D1Database, name: string): Promise<number> {
  // SQLite UPDATE…RETURNING is supported in D1.
  const row = await db
    .prepare("UPDATE counters SET value = value + 1 WHERE name = ?1 RETURNING value")
    .bind(name)
    .first<{ value: number }>();
  if (!row) {
    // Counter row missing — create it lazily.
    await db.prepare("INSERT OR IGNORE INTO counters (name, value) VALUES (?1, 1)").bind(name).run();
    const seeded = await db
      .prepare("SELECT value FROM counters WHERE name = ?1")
      .bind(name)
      .first<{ value: number }>();
    if (!seeded) throw new HttpError(500, `counter ${name} could not be initialized`);
    return seeded.value;
  }
  return row.value;
}

/** Format a counter value as CBR-YYYY-NNNN. */
export function formatTag(prefix: string, value: number, year = new Date().getUTCFullYear()): string {
  return `${prefix}-${year}-${value.toString().padStart(4, "0")}`;
}

/** Mint the next device tag. */
export async function mintDeviceTag(db: D1Database, prefix = "CBR"): Promise<string> {
  const v = await mintCounter(db, "device_tag");
  return formatTag(prefix, v);
}

export async function mintBoxTag(db: D1Database, prefix = "CBR"): Promise<string> {
  const v = await mintCounter(db, "box_tag");
  return formatTag(`${prefix}-BOX`, v);
}

export async function mintPONumber(db: D1Database): Promise<string> {
  const v = await mintCounter(db, "po_number");
  return formatTag("PO", v);
}

export async function mintInvoiceNumber(db: D1Database, prefix = "CBR"): Promise<string> {
  const v = await mintCounter(db, "invoice_number");
  return formatTag(`${prefix}-INV`, v);
}

export async function mintCertNumber(db: D1Database, prefix = "CBR"): Promise<string> {
  const v = await mintCounter(db, "cert_number");
  return formatTag(`${prefix}-CERT`, v);
}

/** Parse JSON body with consistent error shape. */
export async function parseJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

/** Log a device event (chain-of-custody entry). */
export async function logEvent(
  db: D1Database,
  args: {
    deviceId: number;
    eventType: string;
    fromState?: string | null;
    toState?: string | null;
    actor: string;
    payload?: Record<string, unknown> | null;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO device_events (device_id, event_type, from_state, to_state, actor, payload)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    )
    .bind(
      args.deviceId,
      args.eventType,
      args.fromState ?? null,
      args.toState ?? null,
      args.actor,
      args.payload ? JSON.stringify(args.payload) : null
    )
    .run();
}
