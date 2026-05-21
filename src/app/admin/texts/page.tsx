import { readMessages, flattenKeys, NAMESPACES } from "@/lib/admin/texts-data";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { FileText } from "lucide-react";

const NS_COLORS: Record<string, string> = {
  nav:     "#AF5950",
  home:    "#C79A5B",
  cookies: "#4D7792",
  about:   "#AF5950",
  b2b:     "#C79A5B",
  contact: "#4D7792",
  footer:  "#4A8C5C",
  common:  "#6B7280",
};

export default async function TextsPage() {
  const en = await readMessages("en");

  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
          Content
        </p>
        <h1 className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
          Page Texts
        </h1>
        <p className="mt-2 font-sans text-sm" style={{ color: "rgba(232,225,215,0.35)" }}>
          Edit translations for both English and German.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {NAMESPACES.map((ns) => {
          const nsData = (en[ns] ?? {}) as Record<string, unknown>;
          const keyCount = Object.keys(flattenKeys(nsData)).length;
          const color = NS_COLORS[ns] ?? "#AF5950";
          return (
            <Link
              key={ns}
              href={`/admin/texts/${ns}`}
              className="group rounded-xl border p-5 transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}
            >
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <FileText size={17} strokeWidth={1.6} style={{ color }} />
              </div>
              <p className="font-sans text-sm font-semibold capitalize" style={{ color: "#FFFDF8" }}>
                {ns}
              </p>
              <p className="mt-1 font-sans text-xs" style={{ color: "rgba(232,225,215,0.35)" }}>
                {keyCount} keys
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
