import Link from "next/link";
import Reveal from "../components/Reveal";
import {
  CameraIcon, MicIcon, SpeakerIcon, WifiIcon, BluetoothIcon, AntennaIcon,
  CertIcon, ArrowRightIcon, CheckIcon,
} from "../components/Icons";

const capabilities = [
  { Icon: CameraIcon,    title: "Cameras",     desc: "Front, rear, and accessory camera modules physically removed. Apertures sealed and refinished to OEM cosmetics." },
  { Icon: MicIcon,       title: "Microphones", desc: "Primary, secondary, and accessory mics severed from the audio bus at the board level. Verified inert post-removal." },
  { Icon: SpeakerIcon,   title: "Speakers",    desc: "All speaker drivers removed. Devices remain visually intact and fully usable for touch, display, and approved I/O \u2014 with no audible output." },
  { Icon: WifiIcon,      title: "Wi-Fi",       desc: "Wi-Fi radio silicon removed and antenna traces cut. Device cannot associate with any 2.4\u202fGHz or 5\u202fGHz network." },
  { Icon: BluetoothIcon, title: "Bluetooth",   desc: "Bluetooth controller removed and BLE pathways severed. No pairing, no beacons, no covert audio exfiltration." },
  { Icon: AntennaIcon,   title: "Antennas",    desc: "Cellular (LTE/5G), GPS, and NFC antennas and modems removed. Device cannot connect to carrier networks or be geolocated by RF." },
];

const stats = [
  { n: "6", l: "Components removed at the silicon" },
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
    a: "Yes \u2014 with the obvious exceptions of any component you ask us to remove. Touch, display, charging, and approved I/O continue to work. If you redact speakers there is no audio out; if you redact Wi-Fi the device will not associate with networks; and so on. Every removed component is itemized in the unit's Certificate of Redaction.",
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
            Cameras. Microphones. Speakers.<br />
            Wi-Fi. Bluetooth. Antennas. <span className="text-accent">Gone.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl">
            Permanent, silicon-level redaction for iPad and Android tablets.
            Six components, removed at the board — not toggled in software.
            Built for SCIFs, courtrooms, operating rooms, and cellblocks.
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
          <div className="mt-14 surface px-5 py-4 sm:px-6">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:grid-cols-4">
              <li className="flex items-center gap-2 whitespace-nowrap"><CheckIcon size={14} className="text-accent shrink-0" /> US-based facility</li>
              <li className="flex items-center gap-2 whitespace-nowrap"><CheckIcon size={14} className="text-accent shrink-0" /> Background-checked</li>
              <li className="flex items-center gap-2 whitespace-nowrap"><CheckIcon size={14} className="text-accent shrink-0" /> Chain of custody</li>
              <li className="flex items-center gap-2 whitespace-nowrap"><CheckIcon size={14} className="text-accent shrink-0" /> CAGE Code on request</li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="container-xl pb-20">
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.l}
                className={`p-6 sm:p-8 hairline ${i < stats.length - 1 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}
              >
                <div className="font-display text-4xl font-medium tracking-tightest sm:text-5xl">{s.n}</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="container-xl py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><div className="eyebrow">What we remove</div></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-4xl font-medium tracking-tightest sm:text-5xl">
                Six components. <span className="text-accent">Removed, not disabled.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 text-muted">
                MDM toggles get bypassed. Tape peels off. Firmware gets patched.
                Every CBR Labs redaction is performed at the board — there is
                nothing left to disable, jailbreak, or re-enable.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8">
                <Link href="/services" className="btn-ghost px-5 py-2.5 text-[13px]">
                  See full services <ArrowRightIcon size={16} />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 grid gap-px bg-ink/[0.08] sm:grid-cols-2 border hairline">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 50} className="bg-paper">
                <div className="h-full p-6 sm:p-7">
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
              <details className="group py-5">
                <summary className="flex cursor-pointer items-baseline justify-between gap-6 list-none">
                  <span className="font-display text-lg font-medium tracking-tight sm:text-xl">{f.q}</span>
                  <span className="font-mono text-xs text-muted shrink-0 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted">{f.a}</p>
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
