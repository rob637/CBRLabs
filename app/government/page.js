import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ShieldIcon, CheckIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Government Contracting",
  description:
    "CBR Labs LLC — Woman Owned Small Business (WOSB), SAM.gov registered, CAGE 14Y35, UEI K4MZG4KC1MY9. Hardware redaction for federal, state, and local government agencies. Net-30, micro-purchase, BPA-ready.",
  alternates: { canonical: "/government" },
};

const facts = [
  ["SAM.gov", "Active registration", "Ready for federal award"],
  ["Business classification", "Woman Owned Small Business", "WOSB / EDWOSB set-aside eligible"],
  ["CAGE", "14Y35", "Commercial & Government Entity"],
  ["UEI", "K4MZG4KC1MY9", "Unique Entity ID"],
  ["DUNS", "144834451", "Legacy D&B identifier"],
  ["NAICS (primary)", "811210", "Electronic & Precision Equipment Repair"],
  ["NAICS (alt)", "541519", "Other Computer Services"],
  ["NAICS (alt)", "334290", "Other Communications Equipment Mfg"],
  ["PSC", "J070", "Maint/Repair of ADP Equipment"],
  ["PSC", "7035", "ADP Support Equipment"],
  ["Set-aside posture", "Small business · WOSB", "Woman Owned Small Business"],
];

const vehicles = [
  {
    h: "Micro-purchase ($10K and under)",
    p: "Government purchase card accepted. Quote → PO → ship in days, not months. Ideal for single-courtroom or single-unit pilots.",
  },
  {
    h: "Simplified acquisition ($10K – $250K)",
    p: "Formal quote with line items, lead time, and signed terms. Net-30 standard. Performance reports delivered on request.",
  },
  {
    h: "BPA / IDIQ orders",
    p: "We honor agency BPAs with established ceiling and rates. Cohort scheduling, batched audit packets, consolidated invoicing per call order.",
  },
  {
    h: "GSA & schedule resellers",
    p: "Available via authorized resellers under existing schedule contracts. We will work with your contracting officer to validate vehicle eligibility.",
  },
];

const who = [
  {
    h: "Department of Defense & IC",
    p: "SCIFs, SAPFs, ICD 705 spaces, sensitive R&D, and personnel reliability programs. We service contracted vendors and direct agency POs.",
  },
  {
    h: "Department of Justice & BOP",
    p: "Federal correctional facilities and parole programs. Tablets for inmate education, reentry, and counsel-of-record communication.",
  },
  {
    h: "Department of Veterans Affairs",
    p: "Behavioral health units, surgical bays, and PII-sensitive workflows where capture is prohibited by policy.",
  },
  {
    h: "State DOC & DOJ equivalents",
    p: "State and county corrections programs running tablet-based education, telehealth, or family communication.",
  },
  {
    h: "Courts & judicial bodies",
    p: "Federal, state, and municipal courts. Bench, jury, and grand-jury chambers. Discovery and legal-hold workflows.",
  },
  {
    h: "State & local health authorities",
    p: "Public hospitals, behavioral health clinics, and CMS-regulated facilities requiring capture-free patient interaction devices.",
  },
];

export default function GovernmentPage() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Government contracting</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Vetted vendor.<br />
                <span className="text-accent">Cleared paperwork.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                CBR Labs LLC is registered in SAM.gov and ready to receive
                federal, state, and local government purchase orders. Below:
                the codes your contracting officer will ask for, the vehicles
                we work under, and the agencies we serve.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <div className="surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldIcon size={22} className="text-accent" />
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Contracting officer quick card
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Legal name</dt>
                  <dd className="mt-1 text-ink">CBR Labs LLC</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">State of formation</dt>
                  <dd className="mt-1 text-ink">Virginia, USA</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">CAGE</dt>
                  <dd className="mt-1 font-mono text-ink">14Y35</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">UEI</dt>
                  <dd className="mt-1 font-mono text-ink break-all">K4MZG4KC1MY9</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Classification</dt>
                  <dd className="mt-1 text-ink">Woman Owned Small Business (WOSB)</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Address</dt>
                  <dd className="mt-1 text-ink">5927 Tilbury Road, Alexandria, VA 22310</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Direct contact</dt>
                  <dd className="mt-1 text-ink">rob@cbr-labs.com · 703-623-8835</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Codes & registrations */}
      <section className="container-xl pb-20">
        <Reveal>
          <div className="eyebrow">Codes &amp; registrations</div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
            Everything your <span className="text-accent">CO</span> will ask for.
          </h2>
        </Reveal>

        <div className="mt-10 surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/[0.03] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-3">Field</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {facts.map(([k, v, n]) => (
                <tr key={k}>
                  <td className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted whitespace-nowrap">{k}</td>
                  <td className="px-5 py-3 font-mono text-ink">{v}</td>
                  <td className="px-5 py-3 text-muted">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vehicles */}
      <section className="container-xl pb-20">
        <Reveal>
          <div className="eyebrow">How we transact</div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
            Four ways to <span className="text-accent">issue an order</span>.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-px bg-ink/[0.08] md:grid-cols-2 border hairline">
          {vehicles.map((v, i) => (
            <Reveal key={v.h} delay={i * 40} className="bg-paper">
              <div className="h-full p-7">
                <h3 className="font-display text-xl font-medium tracking-tight">{v.h}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{v.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="container-xl pb-20">
        <Reveal>
          <div className="eyebrow">Who we serve</div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
            Built for the agencies that <span className="text-accent">cannot allow capture</span>.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-px bg-ink/[0.08] md:grid-cols-2 lg:grid-cols-3 border hairline">
          {who.map((w, i) => (
            <Reveal key={w.h} delay={i * 40} className="bg-paper">
              <div className="h-full p-7">
                <CheckIcon size={16} className="text-accent" />
                <h3 className="mt-4 font-display text-lg font-medium tracking-tight">{w.h}</h3>
                <p className="mt-3 text-sm text-muted">{w.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <div className="eyebrow">Contracting officers</div>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
                  Send the RFQ, the SOW, or the PO.
                </h2>
                <p className="mt-4 max-w-2xl text-muted">
                  We respond within one business day with a written quote,
                  guaranteed lead time, and the codes you need to award.
                </p>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
                  Send RFQ <ArrowRightIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
