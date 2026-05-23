import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ShieldIcon, CertIcon, CheckIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "About",
  description:
    "CBR Labs is a US-based hardware redaction service for organizations that cannot allow cameras, microphones, or wireless radios on issued tablets.",
  alternates: { canonical: "/about" },
};

const values = [
  { Icon: ShieldIcon, h: "Trust earned, not claimed", p: "Background-checked technicians, serial-level chain of custody, and per-device documentation on every job — single units to fleet rollouts." },
  { Icon: CertIcon, h: "Documentation is the deliverable", p: "Every device leaves with a signed Certificate of Redaction. Your auditors should not have to take our word for anything." },
  { Icon: CheckIcon, h: "Irreversible by design", p: "We work at the silicon. There are no toggles to flip back, no profiles to revert, no firmware path back to a working camera." },
];

export default function About() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <Reveal><div className="eyebrow">About CBR Labs</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
            A quiet shop for the <span className="text-accent">loudest requirements.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-3xl text-lg text-muted">
            CBR Labs exists because the rooms that need tablets most are the rooms that cannot allow a camera, a microphone, or a radio. We modify devices at the hardware level so policy and reality finally agree.
          </p>
        </Reveal>
      </section>

      <section className="container-xl py-12">
        <div className="grid gap-px bg-ink/[0.08] border hairline md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.h} delay={i * 60} className="bg-paper">
              <div className="h-full p-8">
                <v.Icon size={22} className="text-accent" />
                <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{v.h}</h3>
                <p className="mt-3 text-sm text-muted">{v.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="eyebrow">Facility</div>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-ink/90 dark:text-paper/90 leading-relaxed">
            <p>
              Work is performed in our US-based facility by background-checked
              technicians. Devices are received under RMA with serial-level
              tracking and handled in controlled work areas with documented
              chain of custody from receipt through return.
            </p>
            <p>
              We accept tamper-evident shipping requirements, dual-signature
              receipts, and customer-supplied inventory manifests. For
              high-assurance programs we will execute customer NDAs and
              additional handling protocols on request.
            </p>
          </div>
        </div>
      </section>

      <section className="container-xl py-20">
        <Reveal>
          <div className="surface p-10 sm:p-14 grid items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="eyebrow">Work with us</div>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tightest sm:text-4xl">
                Tell us what the policy says &mdash; we&rsquo;ll meet it.
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
                Request a quote <ArrowRightIcon size={16} />
              </Link>
              <Link href="/process" className="btn-ghost px-6 py-3 text-[13px]">Our process</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
