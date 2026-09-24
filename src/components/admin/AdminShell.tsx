"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  email,
  signOutForm,
  children,
}: {
  email?: string | null;
  signOutForm: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 md:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-gray-900 text-white md:hidden">
        <p className="text-sm font-semibold">Wicket &amp; Willow</p>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        >
          <span className="block w-5 h-px bg-white" />
          <span className="block w-5 h-px bg-white" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-gray-900 text-white flex flex-col transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Wicket &amp; Willow</p>
            <p className="text-xs text-white/50">Admin Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-2xl leading-none md:hidden"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${
                pathname === link.href ? "bg-white/10" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 truncate">{email}</p>
          {signOutForm}
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
