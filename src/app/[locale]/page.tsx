import { setRequestLocale } from "next-intl/server";
import { readCookies } from "@/lib/admin/cookies-data";
import { Hero } from "@/components/home/Hero";
import { CookieShowcase } from "@/components/home/CookieShowcase";
import { CookieMarquee } from "@/components/home/CookieMarquee";
import { FeaturedCookies } from "@/components/home/FeaturedCookies";
import { BrandStatement } from "@/components/home/BrandStatement";
import { B2BTeaser } from "@/components/home/B2BTeaser";
import { SocialStrip } from "@/components/home/SocialStrip";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookies = await readCookies();
  const featuredCookies = cookies.filter((c) => c.featured);

  return (
    <>
      <Hero />
      <CookieShowcase />
      <CookieMarquee names={cookies.map((c) => c.name)} />
      <FeaturedCookies cookies={featuredCookies} />
      <BrandStatement />
      <B2BTeaser />
      <SocialStrip />
    </>
  );
}
