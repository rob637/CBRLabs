import Link from "next/link";
import Reveal from "../../components/Reveal";
import { Breadcrumbs } from "../../components/SEO";
import { ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Notes",
  description:
    "Short, plain-language notes from CBR Labs on hardware redaction, SCIF policy, MDM vs. silicon-level removal, and what auditors look for in a tablet program.",
  alternates: { canonical: "/notes/" },
  openGraph: {
    title: "Notes — CBR Labs",
    description:
      "Notes on hardware redaction, SCIF policy, MDM vs. silicon, and tablet program assurance.",
    url: "https://cbr-labs.com/notes/",
  },
};

// Keep posts in sync with app/sitemap.js. Newest first.
export const posts = [
  {
    slug: "hipaa-ambient-capture-bedside-tablet",
    title: "HIPAA, ambient capture, and the tablet at the bedside",
    date: "2026-05-31",
    excerpt:
      "A tablet with a live microphone in a patient room is a HIPAA exposure even when no app is listening. Why ambient capture is the quiet risk in healthcare tablet programs.",
    readingMinutes: 7,
  },
  {
    slug: "icd-705-tablets-scif",
    title: "ICD 705 and tablets: what's actually allowed in a SCIF",
    date: "2026-05-31",
    excerpt:
      "ICD 705 doesn’t list iPads by name. It governs what can record, transmit, or geolocate inside a SCIF. Here’s how that translates to a tablet you’d want to bring inside.",
    readingMinutes: 7,
  },
  {
    slug: "what-is-in-a-certificate-of-redaction",
    title: "What's actually in a Certificate of Redaction",
    date: "2026-05-31",
    excerpt:
      "An auditor asks: what does CBR Labs ship with each redacted tablet? A field-by-field walkthrough of the certificate and the evidence packet behind it.",
    readingMinutes: 6,
  },
  {
    slug: "mdm-vs-hardware-redaction",
    title: "MDM vs. hardware redaction: why a policy is not a sensor",
    date: "2026-05-31",
    excerpt:
      "Mobile Device Management can disable a camera. It cannot remove one. For programs where capture is not just discouraged but forbidden, the distinction matters.",
    readingMinutes: 6,
  },
];

export default function NotesIndex() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Notes", path: "/notes/" }]} />
      <section className="container-xl pt-20 pb-12">
        <Reveal><div className="eyebrow">Notes</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
            Short notes on the <span className="text-accent">work.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Plain-language pieces for procurement, compliance, and IT teams.
            No SEO filler, no sales pitch — just what we&rsquo;ve learned
            redacting tablets for the people who need them silent.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-24">
        <div className="divide-y hairline border-y">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 50}>
              <Link
                href={`/notes/${p.slug}/`}
                className="grid gap-6 py-8 lg:grid-cols-12 items-start group"
              >
                <div className="lg:col-span-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  <time dateTime={p.date}>{p.date}</time>
                  <div className="mt-1">{p.readingMinutes} min read</div>
                </div>
                <div className="lg:col-span-8">
                  <h2 className="font-display text-2xl font-medium tracking-tight group-hover:text-accent transition">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-muted">{p.excerpt}</p>
                </div>
                <div className="lg:col-span-2 lg:text-right">
                  <span className="btn-ghost px-5 py-2.5 text-[12px] inline-flex">
                    Read <ArrowRightIcon size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
