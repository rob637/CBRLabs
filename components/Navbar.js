"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";
import { MenuIcon, CloseIcon } from "./Icons";

const links = [
  ["Services", "/services"],
  ["Pricing", "/pricing"],
  ["Industries", "/industries"],
  ["Government", "/government"],
  ["Process", "/process"],
  ["About", "/about"],
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname?.startsWith("/admin")) return null;
  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <span aria-hidden="true" className="nav-scrim" />
      <div className="container-xl">
        <div className="nav-surface flex items-center justify-between gap-4 px-4 py-2.5">
          <div onClick={() => setOpen(false)}>
            <Wordmark />
          </div>

          <nav className="hidden md:flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-muted hover:text-ink transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="btn-primary hidden sm:inline-flex font-mono text-[11px] uppercase tracking-[0.14em]">
              Request a Quote
            </Link>
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border hairline text-ink"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <CloseIcon size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 surface p-3">
            <nav className="grid gap-1 font-mono text-[11px] uppercase tracking-[0.14em]">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-ink hover:bg-ink/[0.04]"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-1 justify-center font-mono text-[11px] uppercase tracking-[0.14em]"
              >
                Request a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
