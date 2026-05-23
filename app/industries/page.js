import Image from "next/image";
import Reveal from "../../components/Reveal";
import { ShieldIcon, BuildingIcon, HospitalIcon, ScaleIcon, FactoryIcon, CapIcon } from "../../components/Icons";

export const metadata = {
  title: "Industries",
  description:
    "CBR Labs delivers redacted tablets to defense, corrections, healthcare, legal, manufacturing, and education programs.",
  alternates: { canonical: "/industries" },
};

const sectors = [
  { Icon: ShieldIcon, name: "Defense & Intelligence",
    desc: "SCIFs, SAPFs, sensitive R&D labs, and secure build rooms where optical and RF discipline is mandatory.",
    terms: "SCIF · SAPF · ICD 705" },
  { Icon: BuildingIcon, name: "Corrections",
    desc: "Inmate education, reentry, and tablet programs where imaging, recording, and live communication are prohibited.",
    terms: "DOJ · BOP · State DOC" },
  { Icon: HospitalIcon, name: "Healthcare",
    desc: "Operating rooms, ER bays, behavioral health units, and HIPAA-sensitive spaces where ambient capture is not permitted.",
    terms: "HIPAA · TJC · CMS" },
  { Icon: ScaleIcon, name: "Legal & Judicial",
    desc: "Courtrooms, jury and grand-jury chambers, and legal hold workflows where recording devices are strictly forbidden.",
    terms: "Bench · Chambers · Discovery" },
  { Icon: FactoryIcon, name: "Manufacturing & IP",
    desc: "Camera-restricted production lines, trade-secret zones, EV and semiconductor cleanrooms, and contract manufacturing floors.",
    terms: "NDA · ITAR-aware · IP zones" },
  { Icon: CapIcon, name: "Education & Testing",
    desc: "Standardized testing centers, exam rooms, and academic integrity programs requiring sealed, capture-free devices.",
    terms: "Proctoring · 1:1 · Exam mode" },
];

export default function Industries() {
  return (
    <>
      <section className="container-xl pt-20 pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow">Who we serve</div></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
                When the policy says <span className="text-accent">&ldquo;no cameras allowed.&rdquo;</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-muted">
                We partner with IT, physical security, compliance, and procurement
                leaders to deliver mission-fit tablets at scale — across both Apple
                and Android ecosystems.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <figure className="brand-figure aspect-[4/5] lg:aspect-[4/5]">
              <Image
                src="/images/industries.jpg"
                alt="Statue of Lady Justice — a visual stand-in for the regulated environments CBR Labs serves."
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <figcaption className="brand-figure-caption">Regulated environments</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="container-xl pb-24">
        <div className="grid gap-px bg-ink/[0.08] border hairline md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Reveal key={s.name} delay={i * 50} className="bg-paper">
              <div className="h-full p-7">
                <s.Icon size={22} className="text-accent" />
                <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{s.name}</h3>
                <p className="mt-3 text-sm text-muted">{s.desc}</p>
                <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{s.terms}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
