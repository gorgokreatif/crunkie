import { readCookies } from "@/lib/admin/cookies-data";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { DeleteCookieButton } from "./DeleteCookieButton";

export default async function CookiesListPage() {
  const cookies = await readCookies();

  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
            Content
          </p>
          <h1 className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
            Cookies
          </h1>
        </div>
        <Link
          href="/admin/cookies/new"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-sans text-sm font-bold transition-all duration-200 hover:opacity-80"
          style={{ backgroundColor: "#AF5950", color: "#FFFDF8" }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Cookie
        </Link>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(232,225,215,0.06)" }}>
              {["Cookie", "Slug", "Badges", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: "rgba(232,225,215,0.3)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cookies.map((c) => (
              <tr
                key={c.slug}
                className="transition-colors duration-100 hover:bg-[rgba(232,225,215,0.025)]"
                style={{ borderBottom: "1px solid rgba(232,225,215,0.04)" }}
              >
                {/* Image + Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: "rgba(232,225,215,0.06)" }}>
                      <Image src={c.image} alt={c.name} fill className="object-contain p-0.5" />
                    </div>
                    <span className="font-sans text-sm font-medium" style={{ color: "#FFFDF8" }}>
                      {c.name}
                    </span>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-5 py-3.5">
                  <code className="rounded px-2 py-0.5 font-mono text-xs" style={{ backgroundColor: "rgba(232,225,215,0.05)", color: "rgba(232,225,215,0.45)" }}>
                    {c.slug}
                  </code>
                </td>

                {/* Badges */}
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    {c.isVegan && (
                      <span className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: "rgba(74,140,92,0.18)", color: "#4A8C5C" }}>
                        Vegan
                      </span>
                    )}
                    {c.featured && (
                      <span className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: "rgba(199,154,91,0.18)", color: "#C79A5B" }}>
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/cookies/${c.slug}`}
                      className="rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-150 hover:opacity-70"
                      style={{ backgroundColor: "rgba(232,225,215,0.06)", color: "rgba(232,225,215,0.6)" }}
                    >
                      Edit
                    </Link>
                    <DeleteCookieButton slug={c.slug} name={c.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
