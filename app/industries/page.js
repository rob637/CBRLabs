import Image from "next/image";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Industries — CBR Labs" };

const sectors = [
  { name: "Defense & Intelligence", desc: "SCIFs, SAPFs, sensitive R&D labs, and secure build rooms where optical and RF discipline is mandatory.", icon: "🛡️" },
  { name: "Corrections", desc: "Inmate education, reentry, and tablet programs where imaging, recording, and live communication are prohibited.", icon: "🏛️" },
  { name: "Healthcare", desc: "Operating rooms, ER bays, behavioral health units, and HIPAA‑sensitive spaces where ambient capture is not permitted.", icon: "🩺" },
  { name: "Legal & Judicial", desc: "Courtrooms, jury and grand‑jury chambers, and legal hold workflows where recording devices are strictly forbidden.", icon: "⚖️" },
  { name: "Manufacturing & IP", desc: "Camera‑restricted production lines, trade‑secret zones, EV and semiconductor cleanrooms, and contract manufacturing floors.", icon: "🏭" },
  { name: "Education & Testing", desc: "Standardized testing centers, exam rooms, and academic integrity programs requiring sealed, capture‑free devices.", icon: "🎓" },
];

export default function Industries() {
  return (
    <>
      <section className="container-xl pt-16 pb-12">
        <Reveal><div className="chip">Who we serve</div></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            When the policy says <span className="text-gradient">"no cameras allowed."</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            We partner with IT, physical security, compliance, and procurement leaders to deliver mission‑fit tablets at scale — across both Apple and Android ecosystems.
          </p>
        </Reveal>
      </section>

      <section className="container-xl pb-20">
        <Reveal>
          <div className="glass-strong overflow-hidden">
            <div className="relative aspect-[16/7]">
              <Image src="/images/industries.png" alt="Sectors served by CBR Labs" fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Reveal key={s.name} delay={i * 80}>
              <div className="glass h-full p-7 transition hover:-translate-y-1 hover:ring-glow">
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-4 font-semibold tracking-tight">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
