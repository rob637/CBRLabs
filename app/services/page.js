import Image from "next/image";
export const metadata = { title: "Services — CBR Labs LLC" };
const items=[
  {title:"Camera Removal",body:"Front and rear camera modules are removed. External apertures are filled and finished."},
  {title:"Microphone Elimination",body:"All microphone elements are removed or physically severed from the audio path."},
  {title:"Wireless Disablement",body:"Wi‑Fi and Bluetooth radio ICs are removed and antenna traces disconnected. Optional cellular modem removal."},
  {title:"Finish & Test",body:"Cosmetic finishing and full functional tests. Serial-numbered report included."},
];
export default function Services(){
  return(<section className="py-12">
    <h1 className="text-3xl font-bold tracking-tight">Our Services</h1>
    <p className="mt-4 text-slate-300">Irreversible, hardware-level modifications for no‑camera, no‑mic, and no‑wireless policies.</p>
    <div className="mt-8 grid md:grid-cols-2 gap-6">{items.map(it=>(<div key={it.title} className="card"><h3 className="font-semibold text-lg">{it.title}</h3><p className="mt-2 text-sm text-slate-300">{it.body}</p></div>))}</div>
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <Image src="/images/services.png" alt="Technician working on iPad" width={1600} height={900}/>
    </div>
  </section>);
}
