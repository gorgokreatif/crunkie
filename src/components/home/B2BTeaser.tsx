import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Building2, Hotel, Calendar } from "lucide-react";

const segments = [
  { key: "corporate" as const, icon: Building2 },
  { key: "hotels" as const, icon: Hotel },
  { key: "events" as const, icon: Calendar },
];

const stats = [
  { num: "500+", label: "Corporate Orders" },
  { num: "50+", label: "Events" },
  { num: "3★", label: "Hotel Partners" },
];

export async function B2BTeaser() {
  const t = await getTranslations("home.b2bTeaser");
  const tb2b = await getTranslations("b2b.segments");

  return (
    <section className="relative overflow-hidden bg-crunkie-chocolate noise-overlay py-28 lg:py-36">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 90% 50%, rgba(199,154,91,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#E8E1D7 1px,transparent 1px),linear-gradient(90deg,#E8E1D7 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats strip */}
        <ScrollReveal className="mb-20 grid grid-cols-3 divide-x divide-crunkie-cream/10 border border-crunkie-cream/10 bg-crunkie-cream/[0.04]">
          {stats.map(({ num, label }) => (
            <div key={label} className="px-6 py-5 text-center">
              <div className="font-display text-3xl font-black text-crunkie-gold lg:text-4xl">
                {num}
              </div>
              <div className="mt-1 font-sans text-[10px] uppercase tracking-widest text-crunkie-cream/35">
                {label}
              </div>
            </div>
          ))}
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: text */}
          <div>
            <ScrollReveal>
              <span className="mb-4 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-crunkie-gold">
                <span className="h-px w-8 bg-crunkie-gold" />
                {t("label")}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2
                className="mt-4 font-display font-black leading-[0.9] text-crunkie-white"
                style={{ fontSize: "clamp(2.4rem,5.5vw,5rem)" }}
              >
                {t("title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-crunkie-cream/45 lg:text-lg">
                {t("subtitle")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Link
                href="/b2b"
                className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden bg-crunkie-gold px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-dark"
              >
                <span className="absolute inset-0 -translate-x-full bg-crunkie-red transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0" />
                <span className="relative transition-colors duration-200 group-hover:text-crunkie-white">
                  {t("cta")}
                </span>
                <span className="relative transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-crunkie-white">
                  →
                </span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: segment cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {segments.map(({ key, icon: Icon }, i) => (
              <ScrollReveal key={key} delay={0.12 * (i + 1)} direction="up">
                <div className="group border border-crunkie-cream/10 bg-crunkie-cream/[0.04] p-6 transition-all duration-300 hover:border-crunkie-gold/40 hover:bg-crunkie-cream/[0.09]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center border border-crunkie-gold/25 bg-crunkie-gold/10 transition-colors duration-300 group-hover:border-crunkie-gold/60 group-hover:bg-crunkie-gold/20">
                    <Icon size={18} className="text-crunkie-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 font-heading text-sm font-bold leading-snug text-crunkie-white">
                    {tb2b(`${key}.title`)}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed text-crunkie-cream/38">
                    {tb2b(`${key}.body`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
