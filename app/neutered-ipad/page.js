import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { Breadcrumbs } from "../../components/SEO";
import { ArrowRightIcon, CheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Neutered iPad — SCIF-Ready Hardware Redaction",
  description:
    "CBR Labs provides Neutered iPad solutions (sometimes spelled Nuetered iPad) — permanent, hardware-level removal of cameras, microphones, speakers, Wi-Fi, Bluetooth, and cellular for SCIFs, defense, intelligence, and corrections deployments.",
  alternates: { canonical: "/neutered-ipad/" },
  openGraph: {
    title: "Neutered iPad — SCIF-Ready Hardware Redaction",
    description:
      "Permanent, hardware-level removal of cameras, microphones, speakers, Wi-Fi, Bluetooth, and cellular for SCIFs, defense, intelligence, and corrections.",
    url: "https://cbr-labs.com/neutered-ipad/",
  },
};

const removals = [
  ["Cameras", "Front and rear sensors and lens stacks physically excised. Aperture covered or plugged. No software toggle."],
  ["Microphones", "All MEMS mic capsules removed at the board level. Acoustic ports sealed."],
  ["Speakers", "Driver assemblies removed where required. Audio output disabled at the silicon."],
  ["Wireless radios", "Wi-Fi, Bluetooth, NFC, UWB, and cellular modems desoldered or component-killed per scope."],
  ["Antennas", "Antenna runs cut, traces removed, and ground planes verified."],
  ["Sensors", "Optional removal of GPS, ambient light, proximity, magnetometer, and barometer per requirement."],
];

const useCases = [
  ["SCIFs", "Devices that satisfy no-camera, no-microphone, no-wireless facility policies."],
  ["Defense & intelligence", "Field deployments where transmission paths must not exist in the hardware."],
  ["Corrections", "Inmate education tablets that cannot capture, record, or transmit."],
  ["Manufacturing", "Cleanrooms and trade-secret production where photography is prohibited."],
  ["Healthcare", "Operating rooms and HIPAA-sensitive areas requiring no audio or imaging capability."],
  ["Government labs", "Restricted R&amp;D environments where consumer hardware must be hardened."],
];

export default function NeuteredIPad() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Neutered iPad", path: "/neutered-ipad/" }]} />
      <section className="container-xl pt-16 pb-10">
        <Reveal>
          <figure className="brand-figure aspect-[21/9]">
            <Image
              src="/images/services.jpg"
              alt="Neutered iPad on the bench at CBR Labs — cameras, mics, and radios removed."
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
            <figcaption className="brand-figure-caption">Neutered iPad · also spelled “nuetered iPad”</figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="container-xl pb-16">
        <Reveal><div className="eyebrow">SCIF-ready hardware redaction</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl max-w-4xl">
            Neutered <span className="text-accent">iPad.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            CBR Labs specializes in <strong className="text-ink">Neutered iPad</strong> solutions
            (sometimes spelled <em>Nuetered iPad</em>) — permanent, silicon-level removal of every
            component that can capture or transmit. These modifications make iPads suitable for use
            in <strong className="text-ink">SCIFs</strong>, government agencies, defense
            contractors, intelligence operations, and any environment that prohibits cameras,
            microphones, or wireless radios. For the accreditation angle, read{" "}
            <Link href="/notes/icd-705-tablets-scif/" className="text-accent underline-offset-4 hover:underline">
              ICD 705 and tablets
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-accent">
              Request a quote <ArrowRightIcon size={16} />
            </Link>
            <Link href="/process" className="btn-ghost">
              See the process <ArrowRightIcon size={14} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="eyebrow">What we remove</div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Hardware-level, irreversible.
            </h2>
            <p className="mt-4 text-muted">
              Every removal is physical. There are no firmware toggles, no provisioning profiles,
              and no software jail to escape — because the component is no longer on the board.
            </p>
          </Reveal>

          <div className="grid gap-3">
            {removals.map(([title, desc]) => (
              <Reveal key={title}>
                <div className="surface p-5">
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="mt-1 text-accent shrink-0" />
                    <div>
                      <div className="font-display text-base font-medium tracking-tight">{title}</div>
                      <div className="mt-1 text-sm text-muted">{desc}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-xl pb-20">
        <Reveal><div className="eyebrow">Where it&apos;s deployed</div></Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Built for restricted environments.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map(([title, desc]) => (
            <Reveal key={title}>
              <div className="surface p-5 h-full">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{title}</div>
                <div className="mt-2 text-sm text-ink" dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-xl pb-24">
        <Reveal>
          <div className="surface p-8 sm:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">SAM.gov registered · Woman Owned Small Business</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-xs text-muted">CAGE</div>
                <div className="font-display text-lg tracking-tight">14Y35</div>
              </div>
              <div>
                <div className="text-xs text-muted">UEI</div>
                <div className="font-display text-lg tracking-tight break-all">K4MZG4KC1MY9</div>
              </div>
              <div>
                <div className="text-xs text-muted">DUNS</div>
                <div className="font-display text-lg tracking-tight">144834451</div>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted">
              CBR Labs LLC · 5927 Tilbury Road, Alexandria, VA 22310 ·{" "}
              <a href="mailto:rob@cbr-labs.com" className="text-accent hover:underline">rob@cbr-labs.com</a> ·{" "}
              <a href="tel:+17036238835" className="text-accent hover:underline">703-623-8835</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
