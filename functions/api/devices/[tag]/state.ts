// POST /api/devices/:tag/state
// body: { to_state: "ON_BENCH", note?: string, technician?: string }
//
// Advances a device to a new state, optionally setting technician.
// When advancing into CERT_ISSUED a cert_number is minted.
// When advancing into SHIPPED shipped_at is stamped.
// All transitions are written to device_events (chain of custody).
import { Env, json, error, handle, requireActor } from "../../_utils";
import { logEvent, mintCertNumber, parseJson } from "../../_db";

const VALID_STATES = new Set([
  "RECEIVED","INTAKE","IN_QUEUE","ON_BENCH","REDACTED",
  "VERIFIED","CERT_ISSUED","PACKED","SHIPPED","DELIVERED",
  "HOLD","RETURNED",
]);

export const onRequestPost: PagesFunction<Env, "tag"> = ({ env, params, request }) =>
  handle(async () => {
    const actor = requireActor(request);
    const tag = String(params.tag || "");
    const body = await parseJson<{ to_state?: string; note?: string; technician?: string }>(request);
    const toState = (body.to_state || "").toUpperCase();
    if (!VALID_STATES.has(toState)) return error(400, "invalid to_state");

    const device = await env.DB
      .prepare("SELECT id, state, cert_number FROM devices WHERE tag = ?1")
      .bind(tag)
      .first<{ id: number; state: string; cert_number: string | null }>();
    if (!device) return error(404, "device not found");
    if (device.state === toState) return error(409, "already in that state");

    const sets: string[] = ["state = ?1"];
    const binds: unknown[] = [toState];
    if (body.technician) {
      binds.push(body.technician);
      sets.push(`technician = ?${binds.length}`);
    }
    let mintedCert: string | null = null;
    if (toState === "CERT_ISSUED" && !device.cert_number) {
      mintedCert = await mintCertNumber(env.DB);
      binds.push(mintedCert);
      sets.push(`cert_number = ?${binds.length}`);
    }
    if (toState === "SHIPPED") {
      sets.push(`shipped_at = datetime('now')`);
    }

    binds.push(device.id);
    await env.DB
      .prepare(`UPDATE devices SET ${sets.join(", ")} WHERE id = ?${binds.length}`)
      .bind(...binds)
      .run();

    await logEvent(env.DB, {
      deviceId: device.id,
      eventType: "STATE_CHANGE",
      fromState: device.state,
      toState,
      actor,
      payload: {
        note: body.note || null,
        technician: body.technician || null,
        cert_number: mintedCert,
      },
    });

    return json({ ok: true, state: toState, cert_number: mintedCert || device.cert_number });
  });
