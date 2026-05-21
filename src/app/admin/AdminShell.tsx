"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Cookie, FileText, LayoutDashboard, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/cookies",   label: "Cookies",   Icon: Cookie },
  { href: "/admin/texts",     label: "Texts",     Icon: FileText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page — no shell
  if (pathname === "/admin") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0E0906" }}>
      {/* Sidebar */}
      <aside
        className="flex w-56 flex-shrink-0 flex-col border-r"
        style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.06)" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-5" style={{ borderColor: "rgba(232,225,215,0.06)" }}>
          <Image src="/assets/logos/logo-crunkie-light.png" alt="Crunkie" width={90} height={28} className="object-contain" />
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3 pt-4">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: active ? "rgba(175,89,80,0.18)" : "transparent",
                  color: active ? "#AF5950" : "rgba(232,225,215,0.55)",
                }}
              >
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3" style={{ borderColor: "rgba(232,225,215,0.06)" }}>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-all duration-150"
            style={{ color: "rgba(232,225,215,0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#AF5950"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(232,225,215,0.35)"; }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
