import { readCookies } from "@/lib/admin/cookies-data";
import Link from "next/link";
import { Cookie, FileText, Leaf, Star } from "lucide-react";

export default function DashboardPage() {
  const cookies = readCookies();
  const veganCount = cookies.filter((c) => c.isVegan).length;
  const featuredCount = cookies.filter((c) => c.featured).length;

  const stats = [
    { label: "Total Cookies", value: cookies.length, Icon: Cookie,   color: "#AF5950" },
    { label: "Vegan",         value: veganCount,      Icon: Leaf,     color: "#4A8C5C" },
    { label: "Featured",      value: featuredCount,   Icon: Star,     color: "#C79A5B" },
    { label: "Namespaces",    value: 8,               Icon: FileText, color: "#4D7792" },
  ];

  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
          Overview
        </p>
        <h1 className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border p-5"
            style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}
          >
            <div
              className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon size={18} strokeWidth={1.6} style={{ color }} />
            </div>
            <p className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
              {value}
            </p>
            <p className="mt-1 font-sans text-xs" style={{ color: "rgba(232,225,215,0.4)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-lg">
        <Link
          href="/admin/cookies"
          className="flex items-center gap-4 rounded-xl border p-5 transition-all duration-200 hover:border-[rgba(175,89,80,0.35)]"
          style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(175,89,80,0.15)" }}>
            <Cookie size={18} strokeWidth={1.6} style={{ color: "#AF5950" }} />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold" style={{ color: "#FFFDF8" }}>Manage Cookies</p>
            <p className="font-sans text-xs" style={{ color: "rgba(232,225,215,0.35)" }}>Add, edit or delete</p>
          </div>
        </Link>

        <Link
          href="/admin/texts"
          className="flex items-center gap-4 rounded-xl border p-5 transition-all duration-200 hover:border-[rgba(77,119,146,0.35)]"
          style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(77,119,146,0.15)" }}>
            <FileText size={18} strokeWidth={1.6} style={{ color: "#4D7792" }} />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold" style={{ color: "#FFFDF8" }}>Manage Texts</p>
            <p className="font-sans text-xs" style={{ color: "rgba(232,225,215,0.35)" }}>Edit page content EN/DE</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
