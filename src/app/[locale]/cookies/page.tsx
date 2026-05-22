import { getTranslations, setRequestLocale } from "next-intl/server";
import { readCookies } from "@/lib/admin/cookies-data";
import { CookieCard } from "@/components/cookies/CookieCard";
import { CookiesHero } from "@/components/cookies/CookiesHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookies");
  const cookies = await readCookies();

  return (
    <div className="bg-crunkie-dark">
      <CookiesHero
        title={t("title")}
        subtitle={t("subtitle")}
        countLabel={t("count")}
        count={cookies.length}
      />

      <div className="bg-crunkie-white px-5 pb-24 pt-12 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {cookies.map((cookie, i) => (
              <CookieCard key={cookie.slug} cookie={cookie} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
