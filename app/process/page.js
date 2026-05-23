import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Process",
  description:
    "A four-step path to audit-ready redacted tablets: scope, chain of custody, redact and verify, return and support.",
  alternates: { canonical: "/process" },
};

const steps = [
  { title: "Scope & Quote",     text: "Share models, quantities, and timeline. We confirm parts availability and issue a fixed-price quote with a guaranteed lead time." },
  { title: "Chain of Custody",  text: "Devices ship under RMA with serial-level tracking. Optional tamper-evident seals and dual-signature receipts for high-assurance programs." },
  { title: "Redact & Verify",   text: "Hardware redaction performed in our US-based facility. Cosmetic finishing, functional verification, and per-unit before/after photography." },
  { title: "Return & Support",  text: "Devices ship back with serial-numbered Certificates of Redaction and a full audit packet. Optional ongoing replenishment and fleet support." },
];

export default function Process() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <Reveal><div className="eyebrow">How it works</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
            A four-step path to <span className="text-accent">audit-ready</span> devices.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Transparent, documented, and engineered for compliance, procurement,
            and IT security teams. From single units to fleet rollouts.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <ol className="divide-y hairline border-y">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <li className="grid gap-6 py-8 list-none lg:grid-cols-12">
                <div className="lg:col-span-3 flex items-center gap-3">
                  <span className="marker">0{i + 1}</span>
                  <h3 className="font-display text-xl font-medium tracking-tight">{s.title}</h3>
                </div>
                <p className="lg:col-span-9 text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="mt-12 surface overflow-hidden">
            <div className="relative aspect-[16/8]">
              <Image src="/images/process.png" alt="CBR Labs redaction workflow" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
              Start a project <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
