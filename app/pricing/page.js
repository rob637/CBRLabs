import Link from "next/link";
import Reveal from "../../components/Reveal";
import { CheckIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Pricing",
  description:
    "Transparent volume pricing for hardware redaction of iPad and Android tablets. Per-device rates, bulk discounts, and what's always included.",
  alternates: { canonical: "/pricing" },
};

const tiers = [
  {
    name: "Pilot",
    range: "1 – 9 devices",
    price: "$385",
    unit: "per device",
    blurb: "Right-sized for evaluation, proof-of-concept, or a single secure room.",
    cta: "Quote a pilot",
    highlight: false,
  },
  {
    name: "Program",
    range: "10 – 99 devices",
    price: "$315",
    unit: "per device",
    blurb: "Most popular. Covers a courtroom suite, a behavioral health unit, or a single facility rollout.",
    cta: "Quote a program",
    highlight: true,
  },
  {
    name: "Enterprise",
    range: "100 – 999 devices",
    price: "$265",
    unit: "per device",
    blurb: "Multi-site rollouts. Includes pre-staged box tags, batched audit packets, and consolidated invoicing.",
    cta: "Quote enterprise",
    highlight: false,
  },
  {
    name: "Fleet",
    range: "1,000+ devices",
    price: "Custom",
    unit: "per device",
    blurb: "Multi-year contracts, BPA / GSA Schedule pricing, scheduled cohort runs, and on-site coordination.",
    cta: "Talk to us",
    highlight: false,
  },
];

const included = [
  "All six redactions (cameras, mics, speakers, Wi-Fi, Bluetooth, antennas) — or any subset you specify",
  "Serial-numbered Certificate of Redaction per device",
  "Before / after photo packet per device",
  "Full chain-of-custody log from receipt through return",
  "QA test of every remaining system before ship",
  "Return shipping within the contiguous US",
  "30-day workmanship guarantee on the redaction itself",
];

const addons = [
  ["Expedited turn (5 business days)", "+15%"],
  ["Same-week pickup, DC / NoVa / MD", "$95 flat"],
  ["On-site decommission audit (NDA + travel)", "Quote"],
  ["MDM enrollment + DEP staging", "$45 / device"],
  ["Custom asset tagging + engraving", "$12 / device"],
];

export default function PricingPage() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Transparent pricing</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Per-device pricing.<br />
                <span className="text-accent">Volume scales down.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                Published rates so your procurement team can plan. Final quote is
                always written, signed, and includes a guaranteed lead time. No
                hidden bench fees, no per-component upcharges.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <div className="surface p-6 sm:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Federal contracting
              </div>
              <p className="mt-3 text-sm text-muted">
                SAM.gov registered, active. CAGE <span className="font-mono text-ink">14Y35</span>{" "}
                · UEI <span className="font-mono text-ink">K4MZG4KC1MY9</span>.
              </p>
              <p className="mt-3 text-sm text-muted">
                Available under simplified acquisition, micro-purchase, and BPA
                vehicles. Net-30 terms standard on government POs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-px bg-ink/[0.08] md:grid-cols-2 lg:grid-cols-4 border hairline">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 50} className="bg-paper">
              <div className={`h-full p-7 flex flex-col ${t.highlight ? "bg-ink/[0.02]" : ""}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-medium tracking-tight">{t.name}</h3>
                  {t.highlight ? <span className="chip">Most popular</span> : null}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{t.range}</div>

                <div className="mt-6 flex items-baseline gap-2">
                  <div className="font-display text-4xl font-medium tracking-tightest">{t.price}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{t.unit}</div>
                </div>

                <p className="mt-4 text-sm text-muted">{t.blurb}</p>

                <Link href="/contact" className={`mt-6 ${t.highlight ? "btn-accent" : "btn-ghost"} justify-center text-[12px]`}>
                  {t.cta} <ArrowRightIcon size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Indicative pricing for standard iPad / Galaxy Tab / Pixel Tablet. Some models priced separately. Always written quote.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="eyebrow">What's always included</div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
              The line item is the redaction. <span className="text-accent">Everything else is in the price.</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {included.map((p) => (
                <li key={p} className="flex items-start gap-3 text-ink/90">
                  <CheckIcon size={16} className="mt-1 shrink-0 text-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="surface p-6 sm:p-8">
              <div className="eyebrow">Add-ons</div>
              <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">Optional services</h3>
              <ul className="mt-6 divide-y hairline">
                {addons.map(([label, price]) => (
                  <li key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-ink/90">{label}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted whitespace-nowrap">{price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-12 text-center">
            <div className="eyebrow">Next step</div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
              Tell us the device, the count, the redactions.
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-muted">
              You get a written quote with guaranteed lead time within one
              business day. No long forms, no sales calls.
            </p>
            <Link href="/contact" className="btn-accent mt-8 inline-flex px-6 py-3 text-[13px]">
              Request a quote <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
