import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactContent } from "@/components/contact/ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <ContactContent
      title={t("title")}
      subtitle={t("subtitle")}
      formTitle={t("formTitle")}
      form={{
        name: t("form.name"),
        email: t("form.email"),
        message: t("form.message"),
        send: t("form.send"),
        namePlaceholder: t("form.namePlaceholder"),
        emailPlaceholder: t("form.emailPlaceholder"),
        messagePlaceholder: t("form.messagePlaceholder"),
      }}
      infoTitle={t("infoTitle")}
      emailGeneral={t("emailGeneral")}
      emailB2B={t("emailB2B")}
      addressTitle={t("addressTitle")}
      address={t("address")}
      comingSoon={t("comingSoon")}
      directions={t("directions")}
      followUs={t("followUs")}
      generalLabel={t("generalLabel")}
      b2bLabel={t("b2bLabel")}
    />
  );
}
