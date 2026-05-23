// GET  /api/devices                    — list with filters (state, customer_id, po_id, box_tag, q)
// POST /api/devices                    — bulk intake (mint N tags under a PO/customer)
import { Env, json, error, handle, requireActor, paginate } from "./_utils";
import { mintDeviceTag, logEvent, parseJson } from "./_db";

export const onRequestGet: PagesFunction<Env> = ({ env, request }) =>
  handle(async () => {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const customerId = url.searchParams.get("customer_id");
    const poId = url.searchParams.get("po_id");
    const boxTag = url.searchParams.get("box_tag");
    const q = url.searchParams.get("q");
    const { limit, offset } = paginate(url);

    const where: string[] = [];
    const binds: unknown[] = [];
    const add = (clause: string, val: unknown) => {
      binds.push(val);
      where.push(clause.replace("?", `?${binds.length}`));
    };
    if (state)      add("d.state = ?", state);
    if (customerId) add("d.customer_id = ?", Number(customerId));
    if (poId)       add("d.po_id = ?", Number(poId));
    if (boxTag)     add("d.box_tag = ?", boxTag);
    if (q) {
      binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
      where.push(`(d.tag LIKE ?${binds.length - 2} OR d.serial_number LIKE ?${binds.length - 1} OR d.model LIKE ?${binds.length})`);
    }
    binds.push(limit, offset);
    const limitPh = `?${binds.length - 1}`;
    const offsetPh = `?${binds.length}`;

    const sql = `
      SELECT d.id, d.tag, d.box_tag, d.platform, d.model, d.serial_number, d.state,
             d.technician, d.cert_number, d.created_at,
             d.customer_id, c.name AS customer_name,
             d.po_id, po.po_number AS po_number
      FROM devices d
      LEFT JOIN customers c        ON c.id = d.customer_id
      LEFT JOIN purchase_orders po ON po.id = d.po_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY d.created_at DESC
      LIMIT ${limitPh} OFFSET ${offsetPh}`;
    const { results } = await env.DB.prepare(sql).bind(...binds).all();
    return json({ devices: results, limit, offset });
  });

interface IntakeBody {
  customer_id?: number;
  po_id?: number;
  box_tag?: string | null;
  platform?: string;
  default_model?: string;
  redactions?: string[];
  devices?: Array<{ model?: string; serial_number?: string; imei?: string; notes?: string }>;
  count?: number;
}

export const onRequestPost: PagesFunction<Env> = ({ env, request }) =>
  handle(async () => {
    const actor = requireActor(request);
    const body = await parseJson<IntakeBody>(request);

    if (!body.customer_id) return error(400, "customer_id is required");
    const items =
      body.devices && body.devices.length
        ? body.devices
        : Array.from({ length: Math.max(1, Math.min(200, body.count || 1)) }, () => ({}));

    const redactions = body.redactions ? JSON.stringify(body.redactions) : null;
    const platform = body.platform || null;
    const created: Array<Record<string, unknown>> = [];

    // Sequential mint to keep tags monotonic & avoid collisions.
    for (const item of items) {
      const tag = await mintDeviceTag(env.DB);
      const ins = await env.DB
        .prepare(
          `INSERT INTO devices
             (tag, box_tag, po_id, customer_id, platform, model, serial_number, imei, redactions, notes, state)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'RECEIVED')
           RETURNING id, tag, state, model, serial_number, box_tag, po_id, customer_id`
        )
        .bind(
          tag,
          body.box_tag || null,
          body.po_id || null,
          body.customer_id,
          platform,
          item.model || body.default_model || null,
          item.serial_number || null,
          item.imei || null,
          redactions,
          item.notes || null
        )
        .first<{ id: number } & Record<string, unknown>>();
      if (!ins) throw new Error("insert failed");
      await logEvent(env.DB, {
        deviceId: ins.id,
        eventType: "INTAKE",
        toState: "RECEIVED",
        actor,
        payload: { box_tag: body.box_tag, po_id: body.po_id, redactions: body.redactions || null },
      });
      created.push(ins);
    }

    return json({ devices: created }, { status: 201 });
  });
