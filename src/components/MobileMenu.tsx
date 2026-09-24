"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
      >
        <span className="block w-5 h-px bg-text-primary" />
        <span className="block w-5 h-px bg-text-primary" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-bg-page">
          <div className="flex items-center justify-between h-14 px-6 border-b border-border">
            <span className="font-display text-xl tracking-wide">MENU</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-2xl leading-none">
              ×
            </button>
          </div>
          <nav className="flex flex-col px-6 py-8 gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg uppercase tracking-wide font-display"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
