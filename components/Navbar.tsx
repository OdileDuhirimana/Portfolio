"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const firstName = siteConfig.ownerName.trim().split(/\s+/)[0]?.toUpperCase() ?? siteConfig.ownerName.toUpperCase();

  // Close on any in-menu link click rather than syncing via a pathname
  // effect — this avoids the cascading-render anti-pattern of calling
  // setState synchronously inside a useEffect just to react to navigation.
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-30 backdrop-blur supports-backdrop-filter:bg-black/30 bg-black/30 border-b border-(--line)">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-semibold tracking-wide">{firstName}</Link>

        <div className="hidden items-center gap-4 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="relative group">
              <span className="transition-colors group-hover:text-(--gold)">{link.label}</span>
              <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 bg-(--gold) transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link href="/contact" className="rounded-lg bg-(--gold) text-black px-3 py-1.5 font-medium">Hire Me</Link>
          <Link href="/resume" className="rounded-lg border px-3 py-1.5 hover:bg-white/5">Resume</Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-(--line) p-2 text-(--text) md:hidden focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div id={menuId} className="border-t border-(--line) px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu} className="py-1 transition-colors hover:text-(--gold)">
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={closeMenu} className="rounded-lg bg-(--gold) px-3 py-2 text-center font-medium text-black">Hire Me</Link>
            <Link href="/resume" onClick={closeMenu} className="rounded-lg border border-(--line) px-3 py-2 text-center hover:bg-white/5">Resume</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
