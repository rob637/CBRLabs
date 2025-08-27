import Link from "next/link";
export default function Footer(){
  return(<footer className="mt-16 border-t border-white/10">
    <div className="container-lg py-10 text-sm text-slate-400 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center shadow"><span className="text-[10px] font-black">CBR</span></div>
        <div><div className="font-semibold text-slate-200">CBR Labs LLC</div><div className="text-xs">Secure iPad Hardening</div></div>
      </div>
      <div className="space-x-4">
        <Link href="/services" className="hover:text-white">Services</Link>
        <Link href="/industries" className="hover:text-white">Industries</Link>
        <Link href="/process" className="hover:text-white">Process</Link>
        <Link href="/compliance" className="hover:text-white">Compliance</Link>
        <Link href="/contact" className="hover:text-white">Contact</Link>
      </div>
    </div>
    <div className="container-lg pb-10 text-xs text-slate-500">© {new Date().getFullYear()} CBR Labs LLC. Apple, iPad, and iOS are trademarks of Apple Inc. CBR Labs LLC is not affiliated with Apple Inc.</div>
  </footer>);
}
