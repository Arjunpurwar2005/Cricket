import { auth, signOut } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const signOutForm = (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button className="mt-2 text-xs text-white/70 hover:text-white underline">Sign Out</button>
    </form>
  );

  return (
    <AdminShell email={session?.user?.email} signOutForm={signOutForm}>
      {children}
    </AdminShell>
  );
}
