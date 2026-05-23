import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 px-3 pb-6">
      <div className="container-xl">
        <div className="glass px-6 py-10 sm:px-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
                  <span className="text-[10px] font-black text-white">CBR</span>
                </div>
                <div className="leading-tight">
                  <div className="font-semibold">CBR Labs LLC</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Secure iPad Hardening</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-slate-600 dark:text-slate-400">
                Hardware-level modifications for organizations that cannot allow cameras, microphones, or wireless radios in the room.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Company</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/services" className="hover:underline">Services</Link></li>
                <li><Link href="/industries" className="hover:underline">Industries</Link></li>
                <li><Link href="/process" className="hover:underline">Process</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Get in touch</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/contact" className="hover:underline">Request a Quote</Link></li>
                <li><Link href="/compliance" className="hover:underline">Compliance</Link></li>
                <li><a href="mailto:sales@cbrlabs.com" className="hover:underline">sales@cbrlabs.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-900/5 pt-6 text-xs text-slate-500 dark:border-white/5 dark:text-slate-400 sm:flex-row">
            <div>© {new Date().getFullYear()} CBR Labs LLC. All rights reserved.</div>
            <div>Apple, iPad, and iOS are trademarks of Apple Inc. CBR Labs LLC is not affiliated with Apple Inc.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
