"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <h1 className="text-h1 text-center mb-6">Admin</h1>

        <form onSubmit={handleSubmit} className="bg-card border border-default p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-label text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-code text-primary text-body border border-default px-3 py-2 placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="admin@apexui.dev"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-label text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-code text-primary text-body border border-default px-3 py-2 placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-small text-accent mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-label bg-accent text-primary hover:bg-accent-dim transition-colors duration-75"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
