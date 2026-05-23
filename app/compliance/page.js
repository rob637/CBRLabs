import Image from "next/image";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Compliance — CBR Labs" };

const points = [
  "Hardware redactions are permanent and void any remaining manufacturer warranty, including AppleCare and equivalent Android coverage.",
  "CBR Labs LLC is an independent service provider. We are not affiliated with, authorized, sponsored, or endorsed by Apple Inc., Samsung Electronics, Google LLC, or any device manufacturer. iPad, iOS, Apple, Samsung, Galaxy, Android, Google, and Pixel are trademarks of their respective owners.",
  "Customers are responsible for ensuring device configuration and end use comply with their organization's policies and all applicable federal, state, and local laws and regulations.",
  "After redaction, devices may not be eligible for software features that assume the presence of cameras, microphones, GPS, or wireless radios. We document every removed component so your MDM and procurement records stay accurate.",
  "All work is performed in our US‑based facility by background‑checked technicians. Photographic and serial‑level documentation accompanies every device.",
];

export default function Compliance() {
  return (
    <>
      <section className="container-xl pt-16 pb-12">
        <Reveal><div className="chip">Disclosures</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Compliance & <span className="text-gradient">disclaimers</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Plain‑language disclosures for procurement, legal, and risk teams. Written to be read, not skimmed past.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <Reveal>
          <ul className="glass divide-y divide-slate-900/5 dark:divide-white/5">
            {points.map((p, i) => (
              <li key={i} className="flex gap-4 p-6">
                <span className="mt-1 grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-xs text-white">i</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{p}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="mt-10 glass-strong overflow-hidden">
            <div className="relative aspect-[16/7]">
              <Image src="/images/compliance.png" alt="Compliance documentation and audit packet" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
