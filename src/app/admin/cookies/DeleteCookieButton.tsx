"use client";

import { useRouter } from "next/navigation";

export function DeleteCookieButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/cookies/${slug}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-150"
      style={{ backgroundColor: "rgba(175,89,80,0.1)", color: "rgba(175,89,80,0.7)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(175,89,80,0.22)"; (e.currentTarget as HTMLElement).style.color = "#AF5950"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(175,89,80,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(175,89,80,0.7)"; }}
    >
      Delete
    </button>
  );
}
