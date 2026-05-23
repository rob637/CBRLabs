import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Case Studies",
  description:
    "Representative engagements: state corrections education programs, federal courtroom rollouts, behavioral health units, and SCIF refresh cohorts. All names anonymized.",
  alternates: { canonical: "/case-studies" },
};

const studies = [
  {
    sector: "Corrections",
    horizon: "Q4 2025",
    org: "Regional state DOC",
    devices: "152 iPads",
    redactions: "Cameras · Mics · Speakers · Wi-Fi · Cellular · GPS",
    challenge:
      "Statewide reentry program needed tablets for inmate education, but policy prohibited any capture or radio capability. MDM lockdowns had been bypassed in a previous pilot.",
    solution:
      "Cohort of 152 9th-gen iPads redacted in two 76-unit batches. Each device received a serial-numbered Certificate of Redaction and a before/after photo packet. Audit packet exported for DOC compliance archive.",
    outcome:
      "Program approved by facility security review on first submission. Average per-device turn: 6 business days from intake. Zero post-deploy escalations in the first 90 days.",
  },
  {
    sector: "Federal Judiciary",
    horizon: "Q3 2025",
    org: "Federal courthouse, Mid-Atlantic district",
    devices: "24 Pixel Tablets",
    redactions: "Cameras · Mics · Speakers · Bluetooth",
    challenge:
      "Bench and jury chamber pilot. Court IT needed devices that could display case materials but could not capture audio or video of proceedings.",
    solution:
      "Wi-Fi was retained for MDM-managed document delivery; cameras, all mics, speakers, and Bluetooth were physically removed. Cosmetic finishing matched OEM standard for in-chamber use.",
    outcome:
      "Pilot extended to a 96-unit follow-on order. The Chief Judge's order specified CBR-Labs-redacted units by name in the procurement requirement.",
  },
  {
    sector: "Healthcare",
    horizon: "Q2 2025",
    org: "Academic medical center, behavioral health unit",
    devices: "38 iPads",
    redactions: "Cameras · Mics · Speakers · Wi-Fi · Bluetooth · Cellular",
    challenge:
      "Inpatient behavioral health needed durable, capture-free tablets for patient activity and approved telehealth. HIPAA + state mental-health-code constraints made any ambient capture a non-starter.",
    solution:
      "All six components removed. Devices issued in shock-resistant enclosures with USB-only content delivery. Each unit shipped with documentation suitable for the hospital's compliance binder.",
    outcome:
      "Unit reported a 40% reduction in incident reports related to contraband devices in the first six months. Hospital expanded the program to two additional units.",
  },
  {
    sector: "Defense",
    horizon: "Q1 2025",
    org: "Contracted SCIF, NoVA",
    devices: "12 iPads + 8 Galaxy Tabs",
    redactions: "Cameras · Mics · Speakers · Wi-Fi · Bluetooth · Cellular · GPS · NFC",
    challenge:
      "Mixed-platform pilot inside an ICD-705 space. All radios and capture had to be physically eliminated, with documentation suitable for a security officer's inspection binder.",
    solution:
      "Full redaction including NFC controllers. Per-device photo evidence, technician sign-off, and serialized certificates. Chain-of-custody log exported to PDF and CSV.",
    outcome:
      "Pilot devices passed the facility security officer's spot-check on first inspection. Customer placed a follow-on order for 60 devices in the next quarter.",
  },
];

const note =
  "Case studies are anonymized at customer request. Specific names, agencies, and procurement details are available under NDA on request.";

export default function CaseStudiesPage() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal><div className="eyebrow">Engagements</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Programs we've <span className="text-accent">stood up</span>.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                Four representative engagements across corrections, courts,
                healthcare, and defense. Names and exact procurement details
                are withheld at customer request.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="space-y-10">
          {studies.map((s, i) => (
            <Reveal key={s.org} delay={i * 60}>
              <article className="surface p-7 sm:p-10">
                <header className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {String(i + 1).padStart(2, "0")} — {s.sector}
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl">
                      {s.org}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{s.horizon}</div>
                    <div className="mt-1 font-display text-lg font-medium">{s.devices}</div>
                  </div>
                </header>

                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Redactions
                </div>
                <div className="mt-2 text-sm text-ink/90">{s.redactions}</div>

                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Challenge</div>
                    <p className="mt-3 text-sm text-ink/90 leading-relaxed">{s.challenge}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Approach</div>
                    <p className="mt-3 text-sm text-ink/90 leading-relaxed">{s.solution}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Outcome</div>
                    <p className="mt-3 text-sm text-ink/90 leading-relaxed">{s.outcome}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-xs text-muted max-w-2xl mx-auto">{note}</p>
        </Reveal>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-12 text-center">
            <div className="eyebrow">Your program</div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
              Tell us what you need to stand up.
            </h2>
            <Link href="/contact" className="btn-accent mt-8 inline-flex px-6 py-3 text-[13px]">
              Start the conversation <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
