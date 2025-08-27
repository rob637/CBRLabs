import Image from "next/image";
export const metadata = { title: "Compliance — CBR Labs LLC" };
export default function Compliance(){
  return(<section className="py-12">
    <h1 className="text-3xl font-bold tracking-tight">Compliance & Disclaimers</h1>
    <ul className="mt-6 space-y-3 text-sm text-slate-300">
      <li>• Hardware modifications are permanent and will void any manufacturer warranty and AppleCare coverage.</li>
      <li>• CBR Labs LLC is not affiliated with Apple Inc. iPad, iOS, and Apple are trademarks of Apple Inc.</li>
      <li>• Ensure device configuration meets your organization’s policies and applicable laws/regulations.</li>
      <li>• Post‑modification, devices may not be eligible for software features assuming cameras, mics, or radios are present.</li>
    </ul>
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <Image src="/images/compliance.png" alt="Compliance paperwork desk" width={1600} height={900}/>
    </div>
  </section>);
}
