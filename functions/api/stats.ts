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
           (SELECT COUNT(*) FROM devices WHERE state = 'CERT_ISSUED')                AS certs_issued,
           (SELECT COUNT(*) FROM leads WHERE status = 'NEW')                         AS leads_new,
           (SELECT COUNT(*) FROM proposals WHERE status IN ('SENT','VIEWED'))        AS proposals_open,
           (SELECT COUNT(*) FROM invoices WHERE status IN ('SENT','PARTIAL'))        AS invoices_open,
           (SELECT COALESCE(SUM(total_cents),0) FROM invoices WHERE status IN ('SENT','PARTIAL'))
                                                                                     AS ar_total_cents,
           (SELECT COALESCE(SUM(amount_cents),0) FROM cash_receipts
              WHERE date(received_at) >= date('now','start of month'))               AS revenue_this_month_cents,
           (SELECT COUNT(*) FROM documents WHERE expires_at IS NOT NULL
              AND date(expires_at) <= date('now','+30 days'))                        AS docs_expiring_soon`
      )
      .first<Record<string, number>>();

    // AR aging buckets
    const aging = await env.DB
      .prepare(
        `SELECT
           COALESCE(SUM(CASE WHEN julianday('now') - julianday(COALESCE(due_date, issue_date)) <= 0 THEN total_cents ELSE 0 END), 0) AS current_cents,
           COALESCE(SUM(CASE WHEN julianday('now') - julianday(COALESCE(due_date, issue_date)) BETWEEN 0.001 AND 30 THEN total_cents ELSE 0 END), 0) AS d30_cents,
           COALESCE(SUM(CASE WHEN julianday('now') - julianday(COALESCE(due_date, issue_date)) BETWEEN 30.001 AND 60 THEN total_cents ELSE 0 END), 0) AS d60_cents,
           COALESCE(SUM(CASE WHEN julianday('now') - julianday(COALESCE(due_date, issue_date)) > 60 THEN total_cents ELSE 0 END), 0) AS d90_cents
         FROM invoices WHERE status IN ('SENT','PARTIAL')`
      )
      .first<Record<string, number>>();

    return json({
      totals: totals || {},
      by_state: byState.results || [],
      aging: aging || {},
    });
  });
