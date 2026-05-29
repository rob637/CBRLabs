import Link from "next/link";
import Wordmark from "./Wordmark";

const nav = {
  Services: [
    ["iPad redaction", "/services"],
    ["Android tablet redaction", "/services"],
    ["Security & custody", "/security"],
    ["Process", "/process"],
    ["Compliance", "/compliance"],
  ],
  Company: [
    ["About", "/about"],
    ["Industries", "/industries"],
    ["Government", "/government"],
    ["FAQ", "/faq"],
    ["Resources", "/resources"],
    ["Contact", "/contact"],
  ],
  Contact: [
    ["rob@cbr-labs.com", "mailto:rob@cbr-labs.com"],
    ["703-623-8835", "tel:+17036238835"],
    ["Request a quote", "/contact"],
  ],
};

export default function Footer() {
  return (
    <footer className="mt-10 px-3 pb-6">
      <div className="container-xl">
        <div className="surface px-6 py-8 sm:px-10">
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <div><span className="text-ink/80">CAGE</span> · 14Y35</div>
            <div><span className="text-ink/80">UEI</span> · K4MZG4KC1MY9</div>
            <div><span className="text-ink/80">DUNS</span> · 144834451</div>
            <div>SAM.gov registered · Active</div>
            <div>Woman Owned Small Business (WOSB)</div>
            <div>5927 Tilbury Rd · Alexandria, VA 22310</div>
            <div>US-based facility · Background-checked</div>
          </div>

          <div className="rule mt-6" />
          <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              © {new Date().getFullYear()} CBR Labs LLC · All rights reserved
            </div>
            <p className="text-[11px] leading-relaxed text-muted lg:text-right">
              Also known as iPad neutering / nuetered iPads. Apple, iPad, iOS,
              Samsung, Galaxy, Android, Google, and Pixel are trademarks of
              their respective owners. CBR Labs LLC is an independent service
              provider and is not affiliated with any device manufacturer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
