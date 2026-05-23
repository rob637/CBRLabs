import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { CameraIcon, MicIcon, RadioIcon, CertIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Services",
  description:
    "Hardware redaction services for iPad and Android tablets: camera, microphone, and radio removal with a signed Certificate of Redaction.",
  alternates: { canonical: "/services" },
};

const items = [
  { Icon: CameraIcon, title: "Camera Redaction", tag: "Optical",
    body: "Front, rear, and accessory camera modules are physically removed. Apertures are sealed, refinished, and inspected for OEM-grade cosmetic uniformity." },
  { Icon: MicIcon, title: "Microphone Redaction", tag: "Acoustic",
    body: "Primary, secondary, and accessory microphones are severed from the audio bus at the board level and verified inert post-modification." },
  { Icon: RadioIcon, title: "Radio Redaction", tag: "RF",
    body: "Wi-Fi, Bluetooth, NFC, and GPS silicon removed; antenna traces disconnected. Optional cellular modem removal on LTE and 5G models." },
  { Icon: CertIcon, title: "Finish, Test & Certify", tag: "QA",
    body: "Cosmetic finishing, full functional verification, and a serial-numbered Certificate of Redaction delivered with every device." },
];

export default function Services() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <Reveal><div className="eyebrow">Capabilities</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
            Irreversible by design.<br />
            <span className="text-accent">Documented by default.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Every redaction is performed at the hardware level so the function
            cannot be re-enabled by software update, firmware reflash, jailbreak,
            or supply-chain manipulation. We service Apple iPad and leading
            Android tablets — including Samsung Galaxy Tab and Google Pixel Tablet.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-px bg-ink/[0.08] md:grid-cols-2 border hairline">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 60} className="bg-paper">
              <div className="h-full p-7">
                <div className="flex items-center justify-between">
                  <it.Icon size={22} className="text-accent" />
                  <span className="chip">{it.tag}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight">{it.title}</h3>
                <p className="mt-3 text-sm text-muted">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 surface overflow-hidden">
            <div className="relative aspect-[16/8]">
              <Image src="/images/services.png" alt="Technician performing hardware redaction on a tablet" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Link href="/contact" className="btn-accent px-6 py-3 text-[13px]">
              Discuss your specification <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
