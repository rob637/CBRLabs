"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Process", "/process"],
  ["Compliance", "/compliance"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="container-xl">
        <div className="glass-strong flex items-center justify-between gap-4 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="relative h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
              <span className="text-[10px] font-black tracking-tight text-white">CBR</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-semibold tracking-tight text-sm">CBR Labs</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Hardware Redaction</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="btn-gradient hidden sm:inline-flex">
              Get a Quote
            </Link>
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/10 text-slate-700 dark:border-white/10 dark:text-slate-200"
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass-strong p-3">
            <nav className="grid gap-1">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-900/[0.04] dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-gradient mt-1 justify-center">
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
