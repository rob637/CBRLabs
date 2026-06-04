"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "../../components/Icons";
import { trackEvent } from "../../components/Analytics";

const inputClass =
  "mt-1 w-full rounded-xl border bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent hairline";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f).entries());
    try {
      const r = await fetch("/public/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          org: data.company,
          use_case: data.use_case,
          device_count: data.device_count,
          timeline: data.timeline,
          message: data.details,
          source: "contact-form",
          hp: data.hp,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Submission failed. Please email rob@cbr-labs.com.");
      trackEvent("generate_lead", {
        currency: "USD",
        value: 1,
        form_source: "contact-form",
      });
      // Google Ads conversion (SUBMIT_LEAD_FORM in CBR Labs Ads account)
      trackEvent("conversion_event_submit_lead_form", {
        value: 100,
        currency: "USD",
      });
      setSent(true);
      f.reset();
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  if (sent) {
    return (
      <div className="surface p-8 text-center">
        <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckIcon size={18} />
        </div>
        <h3 className="mt-4 font-display text-2xl tracking-tightest">Request received.</h3>
        <p className="mt-3 text-sm text-muted">
          We&rsquo;ll reply within one business day. For urgent matters, call
          {" "}<a href="tel:+17036238835" className="text-accent hover:underline">703-623-8835</a>.
        </p>
        <button onClick={() => setSent(false)} className="btn-ghost mt-6 text-xs">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="surface grid gap-4 p-7">
      {/* Honeypot — hidden field, bots fill it */}
      <input type="text" name="hp" tabIndex={-1} autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

      <label className="text-xs text-muted">
        Name *
        <input name="name" required placeholder="Your name" className={inputClass} />
      </label>
      <label className="text-xs text-muted">
        Company / Organization
        <input name="company" placeholder="Company" className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Work email
          <input name="email" type="email" placeholder="you@org.com" className={inputClass} />
        </label>
        <label className="text-xs text-muted">
          Phone
          <input name="phone" type="tel" placeholder="(555) 555-5555" className={inputClass} />
        </label>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted -mt-2">
        Either email or phone required.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Device count
          <select name="device_count" className={inputClass} defaultValue="">
            <option value="">— select —</option>
            <option value="1-10">1–10</option>
            <option value="10-100">10–100</option>
            <option value="100-500">100–500</option>
            <option value="500+">500+</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </label>
        <label className="text-xs text-muted">
          Timeline
          <select name="timeline" className={inputClass} defaultValue="">
            <option value="">— select —</option>
            <option value="asap">ASAP</option>
            <option value="30d">Within 30 days</option>
            <option value="60d">Within 60 days</option>
            <option value="90d+">90 days or more</option>
            <option value="exploring">Just exploring</option>
          </select>
        </label>
      </div>

      <label className="text-xs text-muted">
        Use case
        <input name="use_case" placeholder="e.g., classified facility kiosks, courtroom evidence review, K-12 device fleet"
          className={inputClass} />
      </label>

      <label className="text-xs text-muted">
        Project details
        <textarea
          name="details"
          rows={5}
          placeholder="Platform (iPad / Android), models (e.g., A2602, Galaxy Tab S9), quantities, deadline, deployment environment, special requirements…"
          className={inputClass}
        />
      </label>

      {err ? <div className="text-sm text-red-700">{err}</div> : null}

      <button type="submit" disabled={busy} className="btn-accent mt-2 py-3 text-[13px]">
        {busy ? "Sending…" : <>Send request <ArrowRightIcon size={16} /></>}
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        By submitting, you agree we may contact you about this request.
      </p>
    </form>
  );
}
