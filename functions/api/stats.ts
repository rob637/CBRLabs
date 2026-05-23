// GET /api/stats — dashboard KPIs
import { Env, json, handle } from "./_utils";

export const onRequestGet: PagesFunction<Env> = ({ env }) =>
  handle(async () => {
    const byState = await env.DB
      .prepare("SELECT state, COUNT(*) AS n FROM devices GROUP BY state")
      .all<{ state: string; n: number }>();

    const totals = await env.DB
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM devices)                                            AS devices_total,
           (SELECT COUNT(*) FROM devices WHERE state NOT IN ('SHIPPED','DELIVERED','RETURNED')) AS devices_open,
           (SELECT COUNT(*) FROM customers)                                          AS customers,
           (SELECT COUNT(*) FROM purchase_orders WHERE status NOT IN ('PAID','CANCELLED')) AS pos_open,
           (SELECT COUNT(*) FROM devices
              WHERE date(created_at) >= date('now','start of month'))                AS intake_this_month,
           (SELECT COUNT(*) FROM devices WHERE state = 'CERT_ISSUED')                AS certs_issued`
      )
      .first<Record<string, number>>();

    return json({
      totals: totals || {},
      by_state: byState.results || [],
    });
  });
