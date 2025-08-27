import Image from "next/image";
import Link from "next/link";

export default function HomePage(){
  return(<section className="py-16">
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">Purpose‑Built, Camera‑Free iPads for High‑Security Environments</h1>
        <p className="mt-6 text-lg text-slate-300 max-w-prose">CBR Labs LLC modifies iPads by permanently removing <b>cameras</b>, <b>microphones</b>, and <b>Wi‑Fi/Bluetooth</b> radios.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/contact" className="btn">Request Pricing</Link>
          <Link href="/services" className="btn bg-slate-800 hover:bg-slate-700">See Services</Link>
        </div>
      </div>
      <div className="relative rounded-3xl overflow-hidden border border-white/10">
        <Image src="/images/home.png" alt="Secure lab environment" width={1600} height={900} priority />
      </div>
    </div>
  </section>);
}
