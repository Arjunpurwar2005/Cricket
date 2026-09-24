"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(searchParams.get("callbackUrl") || "/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1714] px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-8">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="text-sm text-gray-500 mt-1">Wicket &amp; Willow catalogue management</p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-gray-500">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-600"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-gray-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-gray-900 text-white py-2.5 text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
