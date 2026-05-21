import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { AtSign, Music2 } from "lucide-react";
import { cookies } from "@/data/cookies";

export async function SocialStrip() {
  const t = await getTranslations("home.social");
  const grid = cookies.slice(0, 6);

  return (
    <section className="overflow-hidden bg-crunkie-dark">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left: text */}
          <div>
            <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.32em] text-crunkie-cream/30">
              {t("title")}
            </p>
            <h2
              className="mb-6 font-display font-black leading-none text-crunkie-white"
              style={{ fontSize: "clamp(3rem,7vw,6rem)" }}
            >
              @crunkie
              <span className="text-crunkie-red">cookie</span>
            </h2>
            <p className="mb-10 max-w-xs font-sans text-sm leading-relaxed text-crunkie-cream/40">
              {t("handle")}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/crunkiecookie"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-crunkie-red px-7 py-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-white"
              >
                <span className="absolute inset-0 -translate-x-full bg-crunkie-chocolate transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0" />
                <AtSign size={14} className="relative" />
                <span className="relative">Instagram</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="https://www.tiktok.com/@crunkiecookie"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border border-crunkie-cream/15 px-7 py-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-cream/55 transition-all duration-300 hover:border-crunkie-cream/40 hover:text-crunkie-white"
              >
                <Music2 size={14} />
                TikTok
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Right: cookie grid (simulates social feed) */}
          <div className="grid grid-cols-3 gap-0.5">
            {grid.map((c, i) => (
              <div
                key={c.slug}
                className="group relative aspect-square overflow-hidden bg-crunkie-chocolate"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-crunkie-red/80 to-transparent p-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <span className="font-display text-sm font-black italic text-crunkie-white leading-tight">
                    {c.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
