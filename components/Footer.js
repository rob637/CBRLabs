import Link from "next/link";
import Wordmark from "./Wordmark";

const nav = {
  Services: [
    ["iPad redaction", "/services"],
    ["Android tablet redaction", "/services"],
    ["Process", "/process"],
    ["Compliance", "/compliance"],
  ],
  Company: [
    ["About", "/about"],
    ["Industries", "/industries"],
    ["Resources", "/resources"],
    ["Contact", "/contact"],
  ],
  Contact: [
    ["sales@cbrlabs.com", "mailto:sales@cbrlabs.com"],
    ["Request a quote", "/contact"],
    ["RFP response", "/contact"],
  ],
};

export default function Footer() {
  return (
    <footer className="mt-24 px-3 pb-6">
      <div className="container-xl">
        <div className="surface px-6 py-10 sm:px-10">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Wordmark href={null} />
              <p className="mt-4 max-w-md text-sm text-muted">
                Permanent, silicon-level removal of cameras, microphones,
                speakers, Wi-Fi, Bluetooth, and antennas on iPad and Android
                tablets — for organizations that cannot allow capture or
                transmission.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                US-based facility · Background-checked technicians
              </p>
            </div>

            {Object.entries(nav).map(([heading, items]) => (
              <div key={heading} className="md:col-span-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {heading}
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {items.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-ink hover:text-accent transition">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rule mt-10" />
          <div className="mt-6 flex flex-col justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:flex-row">
            <div>© {new Date().getFullYear()} CBR Labs LLC · All rights reserved</div>
            <div className="max-w-xl sm:text-right normal-case tracking-normal text-[11px]">
              Apple, iPad, iOS, Samsung, Galaxy, Android, Google, and Pixel are
              trademarks of their respective owners. CBR Labs LLC is an
              independent service provider and is not affiliated with any device
              manufacturer.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
