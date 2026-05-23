import Link from "next/link";
import Image from "next/image";
import Reveal from "../components/Reveal";
import { CameraIcon, MicIcon, RadioIcon, CertIcon, ArrowRightIcon, CheckIcon } from "../components/Icons";

const capabilities = [
  { Icon: CameraIcon, title: "Camera Redaction", desc: "Front, rear, and accessory cameras are physically removed. Apertures are sealed and refinished to OEM cosmetics." },
  { Icon: MicIcon, title: "Microphone Redaction", desc: "Every microphone — primary, secondary, and accessory — severed from the audio bus at the board level." },
  { Icon: RadioIcon, title: "Radio Redaction", desc: "Wi-Fi, Bluetooth, NFC, GPS, and optional cellular silicon removed. Antenna traces cut." },
  { Icon: CertIcon, title: "Audit-Ready Documentation", desc: "Per-device serials, before/after photography, and a signed chain-of-custody packet for every unit." },
];

const stats = [
  { n: "100%", l: "Hardware-level redaction" },
  { n: "0", l: "Software toggles. Truly irreversible." },
  { n: "48h", l: "Typical turnaround per device" },
  { n: "100%", l: "Devices ship with audit documentation" },
];

const faqs = [
  {
    q: "Why not just disable cameras with MDM?",
    a: "MDM policies are software controls — they can be reverted by a profile change, a wipe, a jailbreak, or an OS update. Hardware redaction physically removes the component. There is nothing left to re-enable.",
  },
  {
    q: "Do you work on both iPad and Android tablets?",
    a: "Yes. We service Apple iPad and leading Android tablets, including Samsung Galaxy Tab and Google Pixel Tablet. Other platforms by request.",
  },
  {
    q: "Does the device still function as a tablet?",
    a: "Yes. Touch, display, speakers, charging, and all non-redacted radios continue to work normally. We document every removed component so your MDM and procurement records stay accurate.",
  },
  {
    q: "What documentation do we receive?",
    a: "Every device ships with a serial-numbered Certificate of Redaction, before/after photography, technician sign-off, and a chain-of-custody record covering receipt through return.",
  },
  {
    q: "What is the turnaround time?",
    a: "Most orders ship in 5 – 10 business days from receipt. We confirm a guaranteed lead time on every quote, with expedited options on request.",
  },
  {
    q: "Will this void the manufacturer warranty?",
    a: "Yes. Hardware modifications void any remaining manufacturer warranty, including AppleCare. We disclose this on every quote.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="container-xl pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="eyebrow">Hardware redaction · iPad &amp; Android</div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tightest sm:text-7xl lg:text-[88px]">
            Camera. Microphone.<br />
            Radio. <span className="text-accent">Gone.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl">
            Permanent, silicon-level redaction for iPad and Android tablets.
            Built for SCIFs, courtrooms, operating rooms, and cellblocks.
            No software. No stickers. No second chances.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
              Request a quote <ArrowRightIcon size={16} />
            </Link>
            <Link href="/services" className="btn-ghost px-6 py-3 text-[13px]">
              See capabilities
            </Link>
          </div>
        </Reveal>

        {/* Trust strip */}
        <Reveal delay={320}>
          <div className="mt-14 surface px-6 py-4">
            <ul className="grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:grid-cols-4">
              <li className="flex items-center gap-2"><CheckIcon size={14} className="text-accent" /> US-based facility</li>
              <li className="flex items-center gap-2"><CheckIcon size={14} className="text-accent" /> Background-checked techs</li>
              <li className="flex items-center gap-2"><CheckIcon size={14} className="text-accent" /> Serial-level chain of custody</li>
              <li className="flex items-center gap-2"><CheckIcon size={14} className="text-accent" /> CAGE Code on request</li>
            </ul>
          </div>
        </Reveal>

        {/* Hero image */}
        <Reveal delay={400}>
          <div className="relative mt-16 surface overflow-hidden p-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src="/images/home.png"
                alt="A redacted tablet on a clean workbench"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="container-xl pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 hairline border-t">
          {stats.map((s) => (
            <div key={s.l} className="border-b border-r last:border-r-0 hairline p-6 sm:p-8">
              <div className="font-display text-4xl font-medium tracking-tightest sm:text-5xl">{s.n}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="container-xl py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><div className="eyebrow">What we do</div></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-4xl font-medium tracking-tightest sm:text-5xl">
                Built for environments where <span className="text-accent">software locks aren&rsquo;t enough.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 text-muted">
                MDM toggles get bypassed. Tape peels off. Firmware gets patched.
                Our redactions are performed at the silicon — there is nothing
                left to disable, jailbreak, or re-enable.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 grid gap-px bg-ink/[0.08] sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 60} className="bg-paper">
                <div className="h-full p-6 sm:p-8">
                  <c.Icon size={22} className="text-accent" />
                  <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-xl py-24">
        <Reveal><div className="eyebrow">Frequently asked</div></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-medium tracking-tightest sm:text-5xl">
            Answers for procurement, IT, and security teams.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y hairline border-t border-b">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <details className="group py-6">
                <summary className="flex cursor-pointer items-baseline justify-between gap-6 list-none">
                  <span className="font-display text-lg font-medium tracking-tight sm:text-xl">{f.q}</span>
                  <span className="font-mono text-xs text-muted shrink-0 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-4 max-w-3xl text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-xl py-24">
        <Reveal>
          <div className="surface relative overflow-hidden p-10 sm:p-16">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="eyebrow">Get started</div>
                <h2 className="mt-5 font-display text-3xl font-medium tracking-tightest sm:text-5xl">
                  Have a redaction requirement?
                </h2>
                <p className="mt-4 max-w-xl text-muted">
                  Send your platform, models, quantities, and deadline. We
                  respond with scope, pricing, and a documented process —
                  typically within one business day.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
                  Start a project <ArrowRightIcon size={16} />
                </Link>
                <Link href="/process" className="btn-ghost px-6 py-3 text-[13px]">Our process</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
