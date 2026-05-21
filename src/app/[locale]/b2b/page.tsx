import { getTranslations, setRequestLocale } from "next-intl/server";
import { B2BContent } from "@/components/b2b/B2BContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b" });
  return {
    title: t("title"),
    description: t("heroBody"),
  };
}

export default async function B2BPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("b2b");

  return (
    <B2BContent
      heroSubtitle={t("heroSubtitle")}
      heroBody={t("heroBody")}
      segmentsTitle={t("segmentsTitle")}
      segments={[
        { title: t("segments.corporate.title"), body: t("segments.corporate.body") },
        { title: t("segments.hotels.title"),    body: t("segments.hotels.body") },
        { title: t("segments.events.title"),    body: t("segments.events.body") },
      ]}
      miniBoxTitle={t("miniBoxTitle")}
      miniBoxSubtitle={t("miniBoxSubtitle")}
      miniBoxBody={t("miniBoxBody")}
      frozenTitle={t("frozenTitle")}
      frozenSubtitle={t("frozenSubtitle")}
      frozenBody={t("frozenBody")}
      frozenSteps={[
        t("frozenInstructions.microwave"),
        t("frozenInstructions.oven"),
        t("frozenInstructions.result"),
      ]}
      customTitle={t("customTitle")}
      customBody={t("customBody")}
      ctaTitle={t("ctaTitle")}
      ctaBody={t("ctaBody")}
      form={{
        name: t("form.name"),
        company: t("form.company"),
        type: t("form.type"),
        quantity: t("form.quantity"),
        message: t("form.message"),
        send: t("form.send"),
        namePlaceholder: t("form.namePlaceholder"),
        companyPlaceholder: t("form.companyPlaceholder"),
        typePlaceholder: t("form.typePlaceholder"),
        quantityPlaceholder: t("form.quantityPlaceholder"),
        messagePlaceholder: t("form.messagePlaceholder"),
      }}
    />
  );
}
