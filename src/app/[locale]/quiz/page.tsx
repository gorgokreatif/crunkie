import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuizFlow } from "@/components/quiz/QuizFlow";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quiz" });
  return {
    title: "Which Crunkie Cookie Are You?",
    description: t("subtitle"),
    openGraph: {
      title: "Which Crunkie Cookie Are You?",
      description: t("subtitle"),
    },
  };
}

export default async function QuizPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuizFlow />;
}
