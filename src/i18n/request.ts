import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { unstable_cache } from "next/cache";
import { list } from "@vercel/blob";

function makeMessageFetcher(locale: string) {
  return unstable_cache(
    async () => {
      try {
        const { blobs } = await list({ prefix: `crunkie-data/messages-${locale}.json` });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url);
          return (await res.json()) as Record<string, unknown>;
        }
      } catch {}
      return null;
    },
    [`messages-${locale}`],
    { tags: [`messages-${locale}`], revalidate: 3600 }
  );
}

const fetchDe = makeMessageFetcher("de");
const fetchEn = makeMessageFetcher("en");

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  const fetcher = locale === "en" ? fetchEn : fetchDe;
  const messages =
    (await fetcher()) ??
    ((await import(`../../messages/${locale}.json`)).default as Record<string, unknown>);

  return { locale, messages };
});
