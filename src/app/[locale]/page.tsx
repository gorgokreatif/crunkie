import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CookieShowcase } from "@/components/home/CookieShowcase";
import { CookieMarquee } from "@/components/home/CookieMarquee";
import { FeaturedCookies } from "@/components/home/FeaturedCookies";
import { BrandStatement } from "@/components/home/BrandStatement";
import { B2BTeaser } from "@/components/home/B2BTeaser";
import { SocialStrip } from "@/components/home/SocialStrip";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <CookieShowcase />
      <CookieMarquee />
      <FeaturedCookies locale={locale} />
      <BrandStatement />
      <B2BTeaser />
      <SocialStrip />
    </>
  );
}
