import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ShieldIcon, CertIcon, CheckIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Security & Custody",
  description:
    "How CBR Labs handles your devices: air-gapped redaction, photo evidence, signed certificates, background-checked technicians, and a US-only chain of custody.",
  alternates: { canonical: "/security" },
};

const pillars = [
  {
    n: "01",
    h: "Air-gapped redaction",
    p: "Every redaction is mechanical and physical. We do not flash firmware, push software, or attach devices to a network during work. A redacted unit cannot ever be re-enabled by an OS update or a profile change because the silicon is gone.",
  },
  {
    n: "02",
    h: "Photo evidence per device",
    p: "Every device is photographed at intake, before redaction, after redaction, and at packing. Photos are tied to the device's serial number and the technician who handled it. The evidence packet ships with the device and is archived for the life of the program.",
  },
  {
    n: "03",
    h: "Signed Certificate of Redaction",
    p: "Each device receives a serial-numbered certificate listing the device, its serial / IMEI, the components removed, the technician, and the date. The certificate carries a QR code linking to an independently verifiable record.",
  },
  {
    n: "04",
    h: "Background-checked technicians",
    p: "Every person who touches your devices is identified, vetted, and logged. No subcontracting, no offshore work, no anonymous benches. Actor identity is recorded on every chain-of-custody event.",
  },
  {
    n: "05",
    h: "US-only chain of custody",
    p: "Devices are received, redacted, certified, and shipped from our Alexandria, VA facility. They never leave the country, they never leave our hands. Every receipt, hand-off, state change, and ship event is logged with a timestamp and an actor.",
  },
  {
    n: "06",
    h: "No data retention",
    p: "We do not image, back up, or extract user data. If a device arrives configured, we wipe it before work and re-wipe after. We are not a forensic vendor; we are a redaction vendor, and we want the smallest possible data footprint.",
  },
];

const handling = [
  ["Receipt", "Devices logged at intake — serial, IMEI, model, condition photo, sealed box tag."],
  ["Queue", "Stored in a locked, access-controlled cage. Only authenticated technicians can pull."],
  ["Bench", "Tagged work tray. Tools are ESD-safe. A single device on the bench at a time."],
  ["Redaction", "Mechanical removal at the board level. No firmware, no software, no network."],
  ["Verify", "Functional test of remaining systems. Photo of the redacted unit, sealed."],
  ["Certify", "Serialized PDF cert minted; bound to the device record and the technician."],
  ["Pack", "Device packed with cert, original accessories (if requested), sealed for return."],
  ["Ship", "Trackable carrier of your choice. Chain-of-custody log exported on request."],
];

const promises = [
  "Your device never leaves the United States",
  "Your device never touches our network",
  "We never image, copy, or retain your data",
  "Every hand-off is logged with a timestamped actor",
  "Every redacted device ships with photographic proof",
  "Every certificate is independently verifiable",
];

export default function SecurityPage() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Security &amp; custody</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Your device.<br />
                <span className="text-accent">Our evidence trail.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                Six commitments that shape how we receive, redact, certify, and
                return every tablet. Written for legal, IT security, and
                physical security teams that need to defend the choice in writing.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <div className="surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldIcon size={22} className="text-accent" />
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Plain-English promises
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {promises.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckIcon size={14} className="mt-1 shrink-0 text-accent" />
                    <span className="text-ink/90">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-px bg-ink/[0.08] md:grid-cols-2 border hairline">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 40} className="bg-paper">
              <div className="h-full p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {p.n} — Pillar
                </div>
                <h3 className="mt-4 font-display text-xl font-medium tracking-tight">{p.h}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{p.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl pb-20">
        <Reveal>
          <div className="eyebrow">Handling timeline</div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
            Eight checkpoints. <span className="text-accent">Every one is logged.</span>
          </h2>
        </Reveal>

        <div className="mt-10 divide-y hairline border-y">
          {handling.map(([h, p], i) => (
            <Reveal key={h} delay={i * 30}>
              <div className="grid gap-6 py-6 lg:grid-cols-12">
                <div className="lg:col-span-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {String(i + 1).padStart(2, "0")} — {h}
                </div>
                <p className="lg:col-span-9 text-ink/90 leading-relaxed">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-12 text-center">
            <CertIcon size={28} className="mx-auto text-accent" />
            <h2 className="mt-6 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
              Every cert is verifiable.
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-muted">
              Scan the QR on any Certificate of Redaction to confirm it was
              issued by CBR Labs, who signed it, and what was removed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/process" className="btn-ghost px-6 py-3 text-[13px]">See the process</Link>
              <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
                Request a quote <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
