import Image from "next/image";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Compliance — CBR Labs LLC" };

const points = [
  "Hardware modifications are permanent and will void any manufacturer warranty and AppleCare coverage.",
  "CBR Labs LLC is not affiliated with Apple Inc. iPad, iOS, and Apple are trademarks of Apple Inc.",
  "Ensure device configuration meets your organization's policies and applicable laws and regulations.",
  "Post‑modification, devices may not be eligible for software features that assume cameras, microphones, or radios are present.",
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
            Plain‑language disclosures for procurement, legal, and risk teams.
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
              <Image src="/images/compliance.png" alt="Compliance paperwork desk" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
