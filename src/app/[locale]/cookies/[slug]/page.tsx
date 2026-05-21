import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cookies, getCookieBySlug, getRelatedCookies } from "@/data/cookies";
import { CookieDetailHero } from "@/components/cookies/CookieDetailHero";
import { CookieCard } from "@/components/cookies/CookieCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return cookies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const cookie = getCookieBySlug(slug);
  if (!cookie) return {};
  return {
    title: cookie.name,
    description:
      locale === "de" ? cookie.description.de : cookie.description.en,
  };
}

export default async function CookieDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookies");

  const cookie = getCookieBySlug(slug);
  if (!cookie) notFound();

  const description =
    locale === "de" ? cookie.description.de : cookie.description.en;
  const related = getRelatedCookies(slug, 4);

  return (
    <div className="bg-crunkie-softcream">

      {/* ── Full-viewport animated hero ── */}
      <CookieDetailHero
        cookie={cookie}
        backLabel={t("backToAll")}
        flavorLabel={t("flavorNotes")}
      />

      {/* ── Description section ── */}
      <div className="relative bg-crunkie-softcream py-24 lg:py-32">
        {/* Diagonal top edge */}
        <div
          className="absolute inset-x-0 -top-[3vw] h-[6vw] bg-crunkie-softcream"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
          <ScrollReveal delay={0}>
            <p
              className="mb-5 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: cookie.isVegan ? "#4A8C5C" : "#AF5950" }}
            >
              <span className="h-px w-6" style={{ backgroundColor: cookie.isVegan ? "#4A8C5C" : "#AF5950" }} />
              {cookie.name}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="font-sans text-xl leading-relaxed text-crunkie-dark/75 lg:text-2xl lg:leading-relaxed">
              {description}
            </p>
          </ScrollReveal>

          {/* Tags */}
          {cookie.tags.length > 0 && (
            <ScrollReveal delay={0.2} className="mt-10 flex flex-wrap gap-2">
              {cookie.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-crunkie-cream bg-crunkie-cream/50 px-3 py-1.5 font-sans text-xs uppercase tracking-widest text-crunkie-dark/50"
                >
                  {tag}
                </span>
              ))}
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* ── Related cookies ── */}
      <div className="bg-crunkie-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <div className="flex items-end justify-between gap-4">
              <h2
                className="font-display font-black text-crunkie-dark"
                style={{ fontSize: "clamp(2rem,5vw,4rem)" }}
              >
                {t("moreCookies")}
              </h2>
              <span className="hidden font-sans text-sm text-crunkie-dark/30 sm:block">
                {related.length} picks
              </span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((c, i) => (
              <CookieCard key={c.slug} cookie={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
