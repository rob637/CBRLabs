import Image from "next/image";
export const metadata = { title: "Process — CBR Labs LLC" };
const steps=[
  {title:"Scope & Quote",text:"Provide models, quantities, timeline. We confirm parts and issue a quote."},
  {title:"Chain of Custody",text:"RMA with serialization; optional tamper‑evident seals."},
  {title:"Modify & Test",text:"Hardware removal, cosmetic finishing, functional verification; photos included."},
  {title:"Return & Support",text:"Devices returned with documentation; optional ongoing support."},
];
export default function Process(){
  return(<section className="py-12">
    <h1 className="text-3xl font-bold tracking-tight">Our Process</h1>
    <p className="mt-4 text-slate-300">Transparent, documented, and built for audit trails.</p>
    <div className="mt-8 grid md:grid-cols-2 gap-6">{steps.map((s,i)=>(<div key={s.title} className="card"><h3 className="font-semibold">{i+1}. {s.title}</h3><p className="text-sm text-slate-300 mt-1">{s.text}</p></div>))}</div>
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <Image src="/images/process.png" alt="Workflow with tools and devices" width={1600} height={900}/>
    </div>
  </section>);
}
