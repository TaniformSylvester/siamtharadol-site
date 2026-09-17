"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-sm border border-line bg-paper p-8 shadow-soft">
      <div>
        <h1 className="font-display text-2xl text-ink">Staff Login</h1>
        <p className="mt-1 text-sm text-ink-soft">Siam Tharadol admin dashboard.</p>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
        />
      </label>

      {error && <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-gold py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
