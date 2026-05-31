import Link from "next/link";
import Reveal from "../../components/Reveal";
import { Breadcrumbs } from "../../components/SEO";
import { ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions from procurement, IT security, and compliance teams about CBR Labs hardware redaction for iPad and Android tablets.",
  alternates: { canonical: "/faq/" },
  openGraph: {
    title: "FAQ — CBR Labs",
    description:
      "Procurement, IT security, and compliance questions about hardware redaction for iPad and Android tablets.",
    url: "https://cbr-labs.com/faq/",
  },
};

const sections = [
  {
    h: "About the redaction",
    qs: [
      {
        q: "Why not just disable cameras with MDM?",
        a: "MDM policies are software controls. They can be reverted by a profile change, a wipe, a jailbreak, or an OS update. Hardware redaction physically removes the component — the camera sensor, the microphone diaphragm, the Wi-Fi radio die. There is nothing left to re-enable.",
      },
      {
        q: "Can a redacted component ever be re-enabled?",
        a: "No. The work is mechanical: silicon is removed from the board, traces are cut, antennas are severed. Reversal would require installing new hardware, not flipping a switch.",
      },
      {
        q: "Do you work on both iPad and Android tablets?",
        a: "Yes. We service Apple iPad and leading Android tablets including Samsung Galaxy Tab and Google Pixel Tablet. Other platforms by request.",
      },
      {
        q: "Does the device still function as a tablet?",
        a: "Yes — with the obvious exceptions of any component you remove. Touch, display, charging, and approved I/O continue to work. Remove speakers and there is no audio out. Remove Wi-Fi and the device will not associate with networks. Every removed component is itemized in the unit's Certificate of Redaction.",
      },
      {
        q: "Can I pick which components to remove?",
        a: "Yes. The default is the full six — cameras, microphones, speakers, Wi-Fi, Bluetooth, antennas — but every order specifies the subset. Many courtroom programs keep Wi-Fi for MDM-managed document delivery and remove only capture devices.",
      },
    ],
  },
  {
    h: "Documentation & evidence",
    qs: [
      {
        q: "What documentation comes with each device?",
        a: "A serial-numbered Certificate of Redaction, a before/after photo packet, technician sign-off, and a chain-of-custody log entry for every hand-off from receipt through ship.",
      },
      {
        q: "Is the certificate independently verifiable?",
        a: "Yes. Each certificate carries a QR code that resolves to an internal verification record — the device, the redactions, the technician, and the date.",
      },
      {
        q: "Can we get the full chain-of-custody log for an audit?",
        a: "Yes. We can export the full event log for any device or program as CSV or PDF, with timestamps and the identity of every actor.",
      },
    ],
  },
  {
    h: "Timing, pricing, and warranty",
    qs: [
      {
        q: "What is the typical turnaround?",
        a: "Most orders ship in 5 – 10 business days from receipt. Expedited 5-business-day turn is available for a 15% surcharge. Every quote includes a guaranteed lead time.",
      },
      {
        q: "What does it cost?",
        a: "Per-device pricing scales with volume. Final quotes are always written and include guaranteed lead time — contact us with your platform, models, and quantities for a quote.",
      },
      {
        q: "Will this void the manufacturer warranty?",
        a: "Yes. Hardware modifications void any remaining manufacturer warranty including AppleCare. We disclose this on every quote. CBR Labs offers a 30-day workmanship guarantee on the redaction itself.",
      },
    ],
  },
  {
    h: "Security, custody & data",
    qs: [
      {
        q: "Where is the work performed?",
        a: "At our US-based facility in Alexandria, Virginia. Devices never leave the United States. There is no subcontracting and no offshore work.",
      },
      {
        q: "Who handles the devices?",
        a: "Background-checked technicians employed by CBR Labs. Every chain-of-custody event records the identity of the technician who touched the device.",
      },
      {
        q: "Do you image, back up, or retain our data?",
        a: "No. We are not a forensic vendor. We wipe arriving devices before work, perform the redaction, and re-wipe before pack-out. We retain no user data.",
      },
      {
        q: "Are the devices networked during redaction?",
        a: "No. Redaction is mechanical and physical. Devices are not connected to a network at any point during the work.",
      },
    ],
  },
  {
    h: "Government & procurement",
    qs: [
      {
        q: "Are you registered in SAM.gov?",
        a: "Yes. Active registration. CAGE 14Y35. UEI K4MZG4KC1MY9. See the Government Contracting page for the full quick card for your contracting officer.",
      },
      {
        q: "Do you work under BPA or IDIQ vehicles?",
        a: "Yes. We honor agency BPAs with established ceiling and rates, and accept call orders against IDIQ contracts.",
      },
      {
        q: "Are you GSA-listed?",
        a: "Available via authorized resellers under existing GSA schedule contracts. Talk to your contracting officer about vehicle eligibility, or contact us and we will coordinate.",
      },
    ],
  },
];

const allQas = sections.flatMap((s) => s.qs);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allQas.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq/" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal><div className="eyebrow">FAQ</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                The questions <span className="text-accent">we keep answering</span>.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                Sourced from procurement officers, CIOs, facility security
                officers, and counsel. If you have a question that isn't here,
                ask — and we'll add it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="space-y-12">
          {sections.map((s, sIdx) => (
            <Reveal key={s.h} delay={sIdx * 60}>
              <div>
                <div className="eyebrow">
                  {String(sIdx + 1).padStart(2, "0")} — {s.h}
                </div>
                <div className="mt-6 divide-y hairline border-y">
                  {s.qs.map((qa) => (
                    <details key={qa.q} className="group py-5">
                      <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                        <h3 className="font-display text-lg font-medium tracking-tight text-ink">{qa.q}</h3>
                        <span className="mt-1 shrink-0 font-mono text-[18px] text-muted transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-4 text-ink/85 leading-relaxed">{qa.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-12 text-center">
            <div className="eyebrow">Still curious?</div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
              We'd rather answer it now than have you guess.
            </h2>
            <Link href="/contact" className="btn-accent mt-8 inline-flex px-6 py-3 text-[13px]">
              Ask a question <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
