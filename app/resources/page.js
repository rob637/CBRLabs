import Link from "next/link";
import Reveal from "../../components/Reveal";
import { Breadcrumbs } from "../../components/SEO";
import { CertIcon, ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Resources",
  description:
    "Spec sheets, sample documentation, and reference material for procurement, legal, and IT teams evaluating hardware redaction.",
  alternates: { canonical: "/resources/" },
  openGraph: {
    title: "Resources — CBR Labs",
    description:
      "Spec sheets, sample Certificates of Redaction, and reference material for procurement, legal, and IT teams.",
    url: "https://cbr-labs.com/resources/",
  },
};

const resources = [
  { kind: "Spec sheet", title: "iPad redaction — services overview", desc: "Per-component summary, deliverables, and lead-time guidance for Apple iPad fleets.", href: "/contact", cta: "Request PDF" },
  { kind: "Spec sheet", title: "Android tablet redaction — services overview", desc: "Coverage matrix for Samsung Galaxy Tab and Google Pixel Tablet families.", href: "/contact", cta: "Request PDF" },
  { kind: "Sample", title: "Certificate of Redaction (sample)", desc: "Anonymized example of the per-device documentation packet your auditors will receive.", href: "/contact", cta: "Request sample" },
  { kind: "Reference", title: "FAQ for procurement & legal", desc: "Common questions on warranty impact, trademark posture, and chain of custody.", href: "/compliance", cta: "Read compliance" },
];

export default function Resources() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Resources", path: "/resources/" }]} />
      <section className="container-xl pt-20 pb-12">
        <Reveal><div className="eyebrow">Resources</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
            For procurement, legal, <span className="text-accent">and IT.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Reference material to help you evaluate, scope, and brief stakeholders on hardware redaction. Request anything below and we&rsquo;ll email it within one business day.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-24">
        <div className="divide-y hairline border-y">
          {resources.map((r, i) => (
            <Reveal key={r.title} delay={i * 50}>
              <div className="grid gap-6 py-8 lg:grid-cols-12 items-start">
                <div className="lg:col-span-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {r.kind}
                </div>
                <div className="lg:col-span-7">
                  <h3 className="font-display text-xl font-medium tracking-tight">{r.title}</h3>
                  <p className="mt-2 text-muted">{r.desc}</p>
                </div>
                <div className="lg:col-span-3 lg:text-right">
                  <Link href={r.href} className="btn-ghost px-5 py-2.5 text-[12px]">
                    {r.cta} <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 surface p-10 sm:p-14 flex items-center gap-6">
            <CertIcon size={28} className="text-accent shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                Need something we don&rsquo;t list?
              </h2>
              <p className="mt-2 text-muted">
                Custom statements of work, white-glove pilots, RFP / RFI responses, and security questionnaires all welcome. <Link href="/contact" className="text-accent underline-offset-4 hover:underline">Get in touch.</Link>
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
