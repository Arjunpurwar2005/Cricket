import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-56 shrink-0 bg-gray-900 text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-sm font-semibold">Wicket &amp; Willow</p>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 truncate">{session?.user?.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button className="mt-2 text-xs text-white/70 hover:text-white underline">Sign Out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
