"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password.");
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0E0906" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image
            src="/assets/logos/logo-crunkie-light.png"
            alt="Crunkie"
            width={130}
            height={40}
            className="object-contain"
          />
        </div>

        <div
          className="rounded-xl border p-8"
          style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.08)" }}
        >
          <p className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "rgba(199,154,91,0.8)" }}>
            Admin Access
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(232,225,215,0.35)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full rounded-lg border px-4 py-3 font-sans text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "rgba(232,225,215,0.05)",
                  borderColor: error ? "#AF5950" : "rgba(232,225,215,0.1)",
                  color: "#FFFDF8",
                }}
                onFocus={(e) => { if (!error) (e.target as HTMLElement).style.borderColor = "rgba(199,154,91,0.5)"; }}
                onBlur={(e) => { if (!error) (e.target as HTMLElement).style.borderColor = "rgba(232,225,215,0.1)"; }}
              />
              {error && (
                <p className="mt-2 font-sans text-xs" style={{ color: "#AF5950" }}>{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 font-sans text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-50"
              style={{ backgroundColor: "#AF5950", color: "#FFFDF8" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#3A241D"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#AF5950"; }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
