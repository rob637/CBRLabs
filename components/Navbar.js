import Link from "next/link";
export default function Navbar(){
  const links=[["Home","/"],["Services","/services"],["Industries","/industries"],["Process","/process"],["Compliance","/compliance"],["Contact","/contact"]];
  return(<header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-950/70">
    <div className="container-lg h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center shadow"><span className="text-xs font-black">CBR</span></div>
        <div><div className="font-black leading-tight text-base">CBR Labs LLC</div><div className="text-xs text-slate-300">Secure iPad Hardening</div></div>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        {links.map(([label,href])=> <Link key={href} href={href} className="text-slate-300 hover:text-white">{label}</Link>)}
      </nav>
      <div className="flex items-center gap-2"><Link href="/contact" className="btn">Get a Quote</Link></div>
    </div></header>);
}