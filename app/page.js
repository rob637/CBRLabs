import Link from "next/link";
import Image from "next/image";
import Reveal from "../components/Reveal";

const capabilities = [
  { title: "Camera Redaction", desc: "Front, rear, and accessory cameras are physically removed. Apertures are sealed and refinished to OEM cosmetics.", icon: "📷" },
  { title: "Microphone Redaction", desc: "Every microphone — primary, secondary, and accessory — severed from the audio bus at the board level.", icon: "🎙️" },
  { title: "Radio Redaction", desc: "Wi‑Fi, Bluetooth, NFC, GPS, and optional cellular silicon removed. Antenna traces cut.", icon: "📡" },
  { title: "Audit‑Ready Documentation", desc: "Per‑device serial records, before/after photography, and a signed chain‑of‑custody packet for every unit.", icon: "📋" },
];

const stats = [
  { n: "100%", l: "Hardware‑level redaction" },
  { n: "0", l: "Software toggles. Truly irreversible." },
  { n: "48h", l: "Typical turnaround per device" },
  { n: "SOC‑grade", l: "Documentation with every unit" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="container-xl pt-16 pb-24 sm:pt-24 sm:pb-32">
        <Reveal>
          <div className="flex justify-center">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trusted in SCIFs, courtrooms, hospitals, prisons, and on the factory floor
            </span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 text-center font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Tablets, <span className="text-gradient">redacted</span>
            <br />
            at the silicon.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400">
            CBR Labs permanently removes the cameras, microphones, and wireless radios from iPad and Android tablets — delivering devices that satisfy the strictest no‑capture, no‑transmit policies. No software. No stickers. No second chances.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-gradient px-6 py-3 text-base">Request a Quote →</Link>
            <Link href="/services" className="btn-ghost px-6 py-3 text-base">See Capabilities</Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="relative mt-16">
            <div className="glass-strong ring-glow overflow-hidden p-2 sm:p-3">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
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
            <div className="pointer-events-none absolute -inset-x-10 -bottom-10 h-40 bg-gradient-to-t from-fuchsia-500/20 via-indigo-500/10 to-transparent blur-3xl" />
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="container-xl pb-20">
        <Reveal>
          <div className="glass grid grid-cols-2 divide-x divide-slate-900/5 overflow-hidden md:grid-cols-4 dark:divide-white/5">
            {stats.map((s) => (
              <div key={s.l} className="p-6 text-center sm:p-8">
                <div className="text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">{s.n}</div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CAPABILITIES */}
      <section className="container-xl py-20">
        <div className="max-w-2xl">
          <Reveal><div className="chip">What we do</div></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Built for environments where <span className="text-gradient">software locks aren't enough</span>.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              MDM toggles get bypassed. Tape peels off. Firmware gets patched. Our redactions are performed at the silicon — there is nothing left to disable, jailbreak, or re‑enable.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="glass h-full p-6 transition hover:-translate-y-1 hover:ring-glow">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="mt-4 font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-xl py-20">
        <Reveal>
          <div className="glass-strong relative overflow-hidden p-10 text-center sm:p-16">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-400/20 via-indigo-500/15 to-fuchsia-500/20" />
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Have a redaction requirement?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
              Send your models, quantities, and deadline. We respond with scope, pricing, and a documented process — typically within one business day.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/contact" className="btn-gradient px-6 py-3">Start a Project</Link>
              <Link href="/process" className="btn-ghost px-6 py-3">See Our Process</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
