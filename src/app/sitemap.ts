import { MetadataRoute } from "next";
import { cookies } from "@/data/cookies";

const baseUrl = "https://crunkiecookie.com";
const locales = ["de", "en"];

const staticRoutes = ["/", "/cookies", "/about", "/b2b", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.8,
    }))
  );

  const cookieEntries: MetadataRoute.Sitemap = cookies.flatMap((cookie) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/cookies/${cookie.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...cookieEntries];
}
