import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Services — CBR Labs" };

const items = [
  { title: "Camera Redaction", body: "Front, rear, and accessory camera modules are physically removed. Apertures are sealed, refinished, and inspected for OEM‑grade cosmetic uniformity.", tag: "Optical" },
  { title: "Microphone Redaction", body: "Primary, secondary, and accessory microphones are severed from the audio bus at the board level and verified inert post‑modification.", tag: "Acoustic" },
  { title: "Radio Redaction", body: "Wi‑Fi, Bluetooth, NFC, and GPS silicon removed; antenna traces disconnected. Optional cellular modem removal on LTE and 5G models.", tag: "RF" },
  { title: "Finish, Test & Certify", body: "Cosmetic finishing, full functional verification, and a serial‑numbered Certificate of Redaction delivered with every device.", tag: "QA" },
];

export default function Services() {
  return (
    <>
      <section className="container-xl pt-16 pb-12">
        <Reveal><div className="chip">Capabilities</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Irreversible by design. <span className="text-gradient">Documented by default.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Every redaction is performed at the hardware level so the function cannot be re‑enabled by software update, firmware reflash, jailbreak, or supply‑chain manipulation. We service Apple iPad and leading Android tablets — including Samsung Galaxy Tab and Google Pixel Tablet.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <div className="glass h-full p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">{it.title}</h3>
                  <span className="chip text-[10px]">{it.tag}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 glass-strong overflow-hidden">
            <div className="relative aspect-[16/8]">
              <Image src="/images/services.png" alt="Technician performing hardware redaction on a tablet" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex justify-center">
            <Link href="/contact" className="btn-gradient px-6 py-3">Discuss your specification</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
