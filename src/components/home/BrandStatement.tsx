import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function BrandStatement() {
  const t = await getTranslations("home.statement");
  const lines = t("quote").split("\n");

  return (
    <section className="relative overflow-hidden bg-crunkie-red noise-overlay py-28 lg:py-40">
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Big background letter */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 select-none overflow-hidden hidden lg:block"
      >
        <span
          className="block font-display font-black italic leading-none text-crunkie-chocolate/25"
          style={{ fontSize: "clamp(14rem,32vw,30rem)" }}
        >
          C
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
        {/* Eyebrow */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-crunkie-white/30" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-crunkie-white/55">
            Our Philosophy
          </span>
          <span className="h-px w-14 bg-crunkie-white/30" />
        </div>

        {/* Giant quote */}
        <blockquote className="mb-10">
          {lines.map((line, i) => (
            <span
              key={i}
              className="block font-display font-black italic leading-[0.88] text-crunkie-white"
              style={{ fontSize: "clamp(2.6rem,7.2vw,6.8rem)" }}
            >
              {line}
            </span>
          ))}
        </blockquote>

        {/* Divider */}
        <div className="mx-auto mb-10 h-px w-20 bg-crunkie-white/30" />

        {/* Body */}
        <p className="mx-auto mb-10 max-w-lg font-sans text-base leading-relaxed text-crunkie-white/65 lg:text-lg">
          {t("body")}
        </p>

        {/* CTA */}
        <Link
          href="/about"
          className="group inline-flex items-center gap-3 border-b-2 border-crunkie-white/35 pb-1 font-sans text-sm font-bold uppercase tracking-[0.22em] text-crunkie-white transition-all duration-200 hover:border-crunkie-white hover:gap-5"
        >
          {t("cta")}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
