import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Process — CBR Labs" };

const steps = [
  { title: "Scope & Quote", text: "Share models, quantities, and timeline. We confirm parts availability and issue a fixed‑price quote with a guaranteed lead time." },
  { title: "Chain of Custody", text: "Devices ship under RMA with serial‑level tracking. Optional tamper‑evident seals and dual‑signature receipts for high‑assurance programs." },
  { title: "Redact & Verify", text: "Hardware redaction performed in our US‑based facility. Cosmetic finishing, functional verification, and per‑unit before/after photography." },
  { title: "Return & Support", text: "Devices ship back with serial‑numbered Certificates of Redaction and a full audit packet. Optional ongoing replenishment, warranty replacement, and fleet support." },
];

export default function Process() {
  return (
    <>
      <section className="container-xl pt-16 pb-12">
        <Reveal><div className="chip">How it works</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            A four‑step path to <span className="text-gradient">audit‑ready</span> devices.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Transparent, documented, and engineered for compliance, procurement, and IT security teams. From single units to fleet rollouts.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <ol className="grid gap-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <li className="glass h-full list-none p-7">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold tracking-tight">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="mt-10 glass-strong overflow-hidden">
            <div className="relative aspect-[16/8]">
              <Image src="/images/process.png" alt="CBR Labs redaction workflow" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex justify-center">
            <Link href="/contact" className="btn-gradient px-6 py-3">Start a project</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
