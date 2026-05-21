import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/about/AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="bg-crunkie-white">
      <AboutContent
        heroTagline={t("heroTagline")}
        storyTitle={t("storyTitle")}
        storyBody={t("storyBody")}
        storyBody2={t("storyBody2")}
        valuesTitle={t("valuesTitle")}
        values={[
          { title: t("values.quality.title"), body: t("values.quality.body") },
          { title: t("values.design.title"),  body: t("values.design.body") },
          { title: t("values.craft.title"),   body: t("values.craft.body") },
        ]}
        locationTitle={t("locationTitle")}
        address={t("address")}
        aachenSoon={t("aachenSoon")}
        getDirections={t("getDirections")}
      />
    </div>
  );
}
