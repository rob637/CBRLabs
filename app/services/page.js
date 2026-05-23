import Link from "next/link";
import Image from "next/image";
import Reveal from "../../components/Reveal";
import {
  CameraIcon, MicIcon, SpeakerIcon, WifiIcon, BluetoothIcon, AntennaIcon,
  CertIcon, ArrowRightIcon,
} from "../../components/Icons";

export const metadata = {
  title: "Services",
  description:
    "Hardware redaction services for iPad and Android tablets: cameras, microphones, speakers, Wi-Fi, Bluetooth, and antennas — with a signed Certificate of Redaction.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    Icon: CameraIcon, title: "Cameras", tag: "Optical",
    body: "Front, rear, and accessory camera modules are physically removed. Apertures are sealed, refinished, and inspected for OEM-grade cosmetic uniformity.",
    points: ["Front + rear modules", "TrueDepth / IR sensors", "Apertures sealed flush"],
  },
  {
    Icon: MicIcon, title: "Microphones", tag: "Acoustic in",
    body: "Primary, secondary, and accessory microphones are severed from the audio bus at the board level and verified inert post-modification.",
    points: ["All mic elements", "Beam-forming arrays", "Headset-jack mic line"],
  },
  {
    Icon: SpeakerIcon, title: "Speakers", tag: "Acoustic out",
    body: "All speaker drivers are physically removed. Devices remain visually intact and fully usable for touch, display, and approved I/O — with no audible output.",
    points: ["Stereo / quad drivers", "Earpiece speaker", "Haptic engine on request"],
  },
  {
    Icon: WifiIcon, title: "Wi-Fi", tag: "RF · LAN",
    body: "Wi-Fi controller silicon is removed and antenna traces cut. The device cannot associate with any 2.4 GHz or 5 GHz network — including ad-hoc and tethered.",
    points: ["802.11 a/b/g/n/ac/ax", "2.4 + 5 GHz antennas", "Wi-Fi Direct disabled"],
  },
  {
    Icon: BluetoothIcon, title: "Bluetooth", tag: "RF · PAN",
    body: "Bluetooth controller is removed and BLE pathways severed. No pairing, no beacons, no covert audio exfiltration via accessory devices.",
    points: ["Classic + BLE", "Pairing & advertising", "Beacon emission"],
  },
  {
    Icon: AntennaIcon, title: "Antennas", tag: "RF · WAN",
    body: "Cellular (LTE / 5G), GPS, and NFC antennas and modems are removed. The device cannot connect to carrier networks or be geolocated by RF.",
    points: ["LTE / 5G modem + SIM", "GPS / GNSS receiver", "NFC controller"],
  },
];

export default function Services() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Capabilities</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                Six redactions.<br />
                <span className="text-accent">All permanent.</span>
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
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <figure className="brand-figure aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
              <Image
                src="/images/services.jpg"
                alt="A tablet device on a clean workbench — the form factor CBR Labs redacts."
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <figcaption className="brand-figure-caption">Tablet redaction · iPad &amp; Android</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-20">
        <div className="grid gap-px bg-ink/[0.08] md:grid-cols-2 lg:grid-cols-3 border hairline">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 50} className="bg-paper">
              <div className="h-full p-7 flex flex-col">
                <div className="flex items-center justify-between">
                  <s.Icon size={22} className="text-accent" />
                  <span className="chip">{s.tag}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-muted">{s.body}</p>
                <ul className="mt-5 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-px w-3 bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Finish & certify — distinct rail */}
        <Reveal>
          <div className="mt-10 surface p-7 sm:p-10 grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-3 flex items-center gap-3">
              <CertIcon size={24} className="text-accent" />
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">07 — QA</div>
            </div>
            <div className="lg:col-span-9">
              <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                Finish, test &amp; certify
              </h3>
              <p className="mt-3 text-muted max-w-3xl">
                Cosmetic finishing, full functional verification of all remaining
                systems, and a serial-numbered <em>Certificate of Redaction</em>
                delivered with every device. Before/after photography and a
                signed chain-of-custody packet ship with every order.
              </p>
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
