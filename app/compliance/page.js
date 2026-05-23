import Image from "next/image";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Compliance & Disclosures",
  description:
    "Plain-language disclosures for procurement, legal, and risk teams: warranty impact, trademark posture, and customer responsibilities.",
  alternates: { canonical: "/compliance" },
};

const points = [
  {
    h: "Warranty impact",
    p: "Hardware redactions are permanent and void any remaining manufacturer warranty, including AppleCare and equivalent Android coverage. We disclose this on every quote.",
  },
  {
    h: "Independent service provider",
    p: "CBR Labs LLC is not affiliated with, authorized, sponsored, or endorsed by Apple Inc., Samsung Electronics, Google LLC, or any device manufacturer. iPad, iOS, Apple, Samsung, Galaxy, Android, Google, and Pixel are trademarks of their respective owners.",
  },
  {
    h: "Customer responsibility",
    p: "Customers are responsible for ensuring device configuration and end use comply with their organization's policies and all applicable federal, state, and local laws and regulations.",
  },
  {
    h: "Feature implications",
    p: "After redaction, devices may not be eligible for software features that assume the presence of cameras, microphones, GPS, or wireless radios. Every removed component is itemized in the unit's Certificate of Redaction so your MDM and procurement records stay accurate.",
  },
  {
    h: "Facility & personnel",
    p: "All work is performed in our US-based facility by background-checked technicians. Photographic and serial-level documentation accompanies every device.",
  },
];

export default function Compliance() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Disclosures</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Compliance & <span className="text-accent">disclaimers</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                Plain-language disclosures for procurement, legal, and risk teams.
                Written to be read, not skimmed past.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <figure className="brand-figure aspect-[4/5] lg:aspect-[4/5]">
              <Image
                src="/images/compliance.jpg"
                alt="Hands signing a document — chain-of-custody and disclosure paperwork accompany every order."
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <figcaption className="brand-figure-caption">Documented · Disclosed</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="divide-y hairline border-y">
          {points.map((pt, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="grid gap-6 py-8 lg:grid-cols-12">
                <div className="lg:col-span-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {String(i + 1).padStart(2, "0")} — {pt.h}
                </div>
                <p className="lg:col-span-9 text-ink/90 dark:text-paper/90 leading-relaxed">{pt.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
